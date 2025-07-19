#!/usr/bin/env node

import init from './utils/init.js';
import cli from './utils/cli.js';
import encrypt from './utils/encrypt.js';
import decrypt from './utils/decrypt.js';
import { 
    encrypt as imageCipherEncrypt, 
    decrypt as imageCipherDecrypt, 
    processBatch, 
    analyzeImage, 
    generateSecurePassword 
} from './utils/imageCipher.js';
import { startInteractiveMode } from './utils/interactiveMode.js';
import { processDirectory } from './utils/batchProcessor.js';
import alert from 'cli-alerts';

const input = cli.input;
const flags = cli.flags;
const { clear } = flags;

(async () => {
	init({ clear });

	input.includes(`help`) && cli.showHelp(0);

	// Create imageCipher functions object
	const imageCipherFunctions = {
		encrypt: imageCipherEncrypt,
		decrypt: imageCipherDecrypt,
		processBatch,
		analyzeImage
	};

	try {
		// Interactive mode
		if (flags.interactive) {
			await startInteractiveMode(imageCipherFunctions);
			return;
		}

		// Image analysis
		if (flags.analyze) {
			const analysis = await analyzeImage(flags.analyze);
			
			console.log('\n📊 Image Analysis');
			console.log('================');
			console.log(`Dimensions: ${analysis.metadata.width}x${analysis.metadata.height}`);
			console.log(`Format: ${analysis.metadata.format}`);
			console.log(`Channels: ${analysis.metadata.channels}`);
			console.log(`Color Space: ${analysis.metadata.space}`);
			console.log(`File Size: ${(analysis.metadata.size / 1024).toFixed(2)} KB`);
			console.log(`Entropy: ${analysis.entropy.toFixed(2)}`);
			console.log(`Color Profile: ${analysis.colorProfile}`);
			return;
		}

		// Batch processing
		if (flags.batch && flags.operation) {
			console.log(`🔄 Starting batch ${flags.operation}...`);
			
			const operationFunc = flags.operation === 'encrypt' ? 
				(input, output, opts) => imageCipherEncrypt(input, output, { ...opts, password: flags.password }) :
				(input, output, opts) => imageCipherDecrypt(input, output, { ...opts, password: flags.password, keyPath: flags.key });

			const batchOptions = {
				recursive: flags.recursive,
				outputDir: flags.outputDir
			};

			const results = await processDirectory(flags.batch, operationFunc, flags, batchOptions);
			
			const successful = results.filter(r => r.status === 'success').length;
			const failed = results.filter(r => r.status === 'error').length;
			
			alert({
				type: `success`,
				name: `Batch Processing Complete`,
				msg: `${successful} successful, ${failed} failed`
			});
			return;
		}

		// Enhanced encryption
		if (flags.encrypt) {
			// Generate password if requested
			if (flags.generatePassword) {
				flags.password = generateSecurePassword();
				console.log(`🔑 Generated password: ${flags.password}`);
			}

			const result = await imageCipherEncrypt(flags.encrypt, flags.outputImageFileName, {
				password: flags.password,
				keyPath: flags.outputKeyFileName,
				algorithm: flags.algorithm
			});

			alert({
				type: `success`,
				name: `Encryption Successful`,
				msg: `Image encrypted successfully:\nOutput: ${result.outputPath}\nMethod: ${result.method}${result.keyPath ? `\nKey: ${result.keyPath}` : ''}`
			});
			return;
		}

		// Enhanced decryption  
		if (flags.decrypt) {
			const result = await imageCipherDecrypt(flags.decrypt, flags.outputImageFileName, {
				password: flags.password,
				keyPath: flags.key
			});

			alert({
				type: `success`,
				name: `Decryption Successful`,
				msg: `Image decrypted successfully:\nOutput: ${result.outputPath}\nMethod: ${result.method}`
			});
			return;
		}

		// Fallback to original behavior if no new flags are used
		if (flags.encrypt) {
			await encrypt(flags);
		} else if (flags.decrypt) {
			await decrypt(flags);
		}

	} catch (error) {
		alert({
			type: `error`,
			name: `Error`,
			msg: error.message
		});
		process.exit(1);
	}

	// Footer message
	const chalk = (await import(`chalk`)).default;
	console.log(
		chalk.bgMagenta(` Give it a star on github: `) +
			chalk.bold(` https://github.com/AdityaKrSingh26/ImageCipher `)
	);
})();