import fs from 'fs';
import crypto from 'crypto';
import jimp from 'jimp';
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
		// Read image with jimp
		const image = await jimp.read(inputPath);
		const extension = image.getExtension();

		// Get RGBA data
		const rgba = image.bitmap.data;
		const length = rgba.length;

		// Generate random key
		const key = [];
		for (let i = 0; i < length; i++) {
			key.push(Math.floor(Math.random() * 256));
		}

		// Encrypt pixels with XOR
		for (let i = 0; i < length; i++) {
			rgba[i] = rgba[i] ^ key[i];
		}

		// Update image data
		image.bitmap.data = rgba;

		// Generate output paths
		const baseName = path.basename(inputPath, path.extname(inputPath));
		const finalOutputPath = outputPath || `${baseName}_encrypted.${extension}`;
		const keyPath = options.keyPath || `${baseName}_key.txt`;

		// Save encrypted image
		await image.writeAsync(finalOutputPath);

		// Save key
		fs.writeFileSync(keyPath, Buffer.from(key).toString('base64'));

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
		// Read encrypted image
		const image = await jimp.read(inputPath);
		const extension = image.getExtension();
		const rgba = image.bitmap.data;
		const length = rgba.length;

		// Read and decode key
		if (!options.keyPath && !options.key) {
			throw new Error('Key file path or key is required for XOR decryption');
		}

		let keyArray;
		if (options.keyPath) {
			const keyBase64 = fs.readFileSync(options.keyPath, 'utf8');
			const keyBuffer = Buffer.from(keyBase64, 'base64');
			keyArray = Array.from(keyBuffer);
		} else {
			keyArray = options.key;
		}

		// Validate key length
		if (keyArray.length !== length) {
			throw new Error('Key length does not match image data length');
		}

		// Decrypt pixels with XOR
		for (let i = 0; i < length; i++) {
			rgba[i] = rgba[i] ^ keyArray[i];
		}

		// Update image data
		image.bitmap.data = rgba;

		// Generate output path
		const finalOutputPath = outputPath || generateOutputPath(inputPath, '_decrypted');

		// Save decrypted image
		await image.writeAsync(finalOutputPath);

		return {
			outputPath: finalOutputPath,
			method: 'xor'
		};
	} catch (error) {
		throw new Error(`XOR decryption failed: ${error.message}`);
	}
}

async function encrypt(inputPath, outputPath = null, options = {}) {
	// Check if password-based encryption is requested
	if (options.password) {
		return await encryptWithPasswordMethod(inputPath, outputPath, options);
	}

	// Use existing XOR encryption method
	return await encryptWithXOR(inputPath, outputPath, options);
}

async function decrypt(inputPath, outputPath = null, options = {}) {
	// Check if password-based decryption is requested
	if (options.password) {
		return await decryptWithPasswordMethod(inputPath, outputPath, options);
	}

	// Use existing XOR decryption method
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
