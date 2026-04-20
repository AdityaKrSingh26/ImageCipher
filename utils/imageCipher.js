import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import path from 'path';
import { encryptWithPassword, decryptWithPassword, generateSecurePassword } from './passwordEncryption.js';
import { analyzeImage, convertImageFormat } from './imageProcessor.js';
import { processDirectory } from './batchProcessor.js';

function generateOutputPath(inputPath, suffix) {
	const parsed = path.parse(inputPath);
	return path.join(parsed.dir, `${parsed.name}${suffix}${parsed.ext}`);
}

async function encryptWithPasswordMethod(inputPath, outputPath = null, options = {}) {
	try {
		// Read image file as buffer
		const imageBuffer = fs.readFileSync(inputPath);

		// Encrypt the buffer
		const encryptedBuffer = encryptWithPassword(imageBuffer, options.password);

		// Generate output path
		const finalOutputPath = outputPath || generateOutputPath(inputPath, '_encrypted');

		// Write encrypted data
		fs.writeFileSync(finalOutputPath, encryptedBuffer);

		return {
			outputPath: finalOutputPath,
			method: 'password',
			algorithm: 'aes-256-gcm'
		};
	} catch (error) {
		throw new Error(`Password encryption failed: ${error.message}`);
	}
}

async function decryptWithPasswordMethod(inputPath, outputPath = null, options = {}) {
	try {
		// Read encrypted file
		const encryptedBuffer = fs.readFileSync(inputPath);

		// Decrypt the buffer
		const decryptedBuffer = decryptWithPassword(encryptedBuffer, options.password);

		// Generate output path
		const finalOutputPath = outputPath || generateOutputPath(inputPath, '_decrypted');

		// Write decrypted data
		fs.writeFileSync(finalOutputPath, decryptedBuffer);

		return {
			outputPath: finalOutputPath,
			method: 'password'
		};
	} catch (error) {
		throw new Error(`Password decryption failed: ${error.message}`);
	}
}

async function encryptWithXOR(inputPath, outputPath = null, options = {}) {
	try {
		const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
		const length = data.length;

		const key = crypto.randomBytes(length);

		for (let i = 0; i < length; i++) {
			data[i] = data[i] ^ key[i];
		}

		const ext = path.extname(inputPath).slice(1) || 'png';
		const baseName = path.basename(inputPath, path.extname(inputPath));
		const finalOutputPath = outputPath || `${baseName}_encrypted.${ext}`;
		const keyPath = options.keyPath || `${baseName}_key.txt`;

		await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
			.toFormat(ext)
			.toFile(finalOutputPath);

		fs.writeFileSync(keyPath, key.toString('base64'));

		return {
			outputPath: finalOutputPath,
			keyPath: keyPath,
			method: 'xor'
		};
	} catch (error) {
		throw new Error(`XOR encryption failed: ${error.message}`);
	}
}

async function decryptWithXOR(inputPath, outputPath = null, options = {}) {
	try {
		const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
		const length = data.length;

		if (!options.keyPath && !options.key) {
			throw new Error('Key file path or key is required for XOR decryption');
		}

		let keyBuffer;
		if (options.keyPath) {
			keyBuffer = Buffer.from(fs.readFileSync(options.keyPath, 'utf8'), 'base64');
		} else {
			keyBuffer = Buffer.isBuffer(options.key) ? options.key : Buffer.from(options.key);
		}

		if (keyBuffer.length !== length) {
			throw new Error('Key length does not match image data length');
		}

		for (let i = 0; i < length; i++) {
			data[i] = data[i] ^ keyBuffer[i];
		}

		const ext = path.extname(inputPath).slice(1) || 'png';
		const finalOutputPath = outputPath || generateOutputPath(inputPath, '_decrypted');

		await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
			.toFormat(ext)
			.toFile(finalOutputPath);

		return {
			outputPath: finalOutputPath,
			method: 'xor'
		};
	} catch (error) {
		throw new Error(`XOR decryption failed: ${error.message}`);
	}
}

async function encrypt(inputPath, outputPath = null, options = {}) {
	if (options.algorithm === 'xor') {
		return await encryptWithXOR(inputPath, outputPath, options);
	}
	if (options.algorithm === 'aes' && !options.password) {
		throw new Error('AES encryption requires --password/-p');
	}
	if (options.password) {
		return await encryptWithPasswordMethod(inputPath, outputPath, options);
	}
	return await encryptWithXOR(inputPath, outputPath, options);
}

async function decrypt(inputPath, outputPath = null, options = {}) {
	if (options.algorithm === 'xor') {
		return await decryptWithXOR(inputPath, outputPath, options);
	}
	if (options.algorithm === 'aes' && !options.password) {
		throw new Error('AES decryption requires --password/-p');
	}
	if (options.password) {
		return await decryptWithPasswordMethod(inputPath, outputPath, options);
	}
	return await decryptWithXOR(inputPath, outputPath, options);
}

async function processBatch(directory, operation, options = {}) {
	const operationFunc = operation === 'encrypt' ?
		(input, output, opts) => encrypt(input, output, opts) :
		(input, output, opts) => decrypt(input, output, opts);

	return await processDirectory(directory, operationFunc, options, options);
}

export {
	encrypt,
	decrypt,
	encryptWithPasswordMethod,
	decryptWithPasswordMethod,
	encryptWithXOR,
	decryptWithXOR,
	processBatch,
	analyzeImage,
	convertImageFormat,
	generateOutputPath,
	generateSecurePassword
};
