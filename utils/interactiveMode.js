import readline from 'readline';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function askQuestion(question, rl) {
	return new Promise((resolve) => {
		rl.question(question, resolve);
	});
}

function generateSecurePassword(length = 16) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	let password = '';

	for (let i = 0; i < length; i++) {
		password += chars.charAt(crypto.randomInt(0, chars.length));
	}

	return password;
}

async function encryptWorkflow(imageCipherFunctions, rl) {
	console.log('\n🔒 Image Encryption Wizard');
	console.log('==========================\n');

	const imagePath = await askQuestion('Enter image path: ', rl);

	if (!fs.existsSync(imagePath)) {
		console.log('❌ Image file not found!');
		return;
	}

	const usePassword = await askQuestion('Use password-based encryption? (y/n): ', rl);
	let encryptionOptions = {};

	if (usePassword.toLowerCase() === 'y') {
		const password = await askQuestion('Enter password (or press Enter to generate): ', rl);
		encryptionOptions.password = password || generateSecurePassword();
		if (!password) {
			console.log(`🔑 Generated password: ${encryptionOptions.password}`);
		}
	}

	const outputPath = await askQuestion('Output path (or press Enter for auto): ', rl) || null;

	try {
		console.log('\n🔄 Encrypting...');
		const result = await imageCipherFunctions.encrypt(imagePath, outputPath, encryptionOptions);
		console.log('✅ Encryption successful!');
		console.log(`📁 Output: ${result.outputPath}`);

		if (result.keyPath) {
			console.log(`🔑 Key saved: ${result.keyPath}`);
		}
	} catch (error) {
		console.log('❌ Encryption failed:', error.message);
	}
}

async function decryptWorkflow(imageCipherFunctions, rl) {
	console.log('\n🔓 Image Decryption Wizard');
	console.log('==========================\n');

	const imagePath = await askQuestion('Enter encrypted image path: ', rl);

	if (!fs.existsSync(imagePath)) {
		console.log('❌ Encrypted image file not found!');
		return;
	}

	const usePassword = await askQuestion('Was this encrypted with a password? (y/n): ', rl);
	let decryptionOptions = {};

	if (usePassword.toLowerCase() === 'y') {
		decryptionOptions.password = await askQuestion('Enter password: ', rl);
	} else {
		const keyPath = await askQuestion('Enter key file path: ', rl);
		if (!fs.existsSync(keyPath)) {
			console.log('❌ Key file not found!');
			return;
		}
		decryptionOptions.keyPath = keyPath;
	}

	const outputPath = await askQuestion('Output path (or press Enter for auto): ', rl) || null;

	try {
		console.log('\n🔄 Decrypting...');
		const result = await imageCipherFunctions.decrypt(imagePath, outputPath, decryptionOptions);
		console.log('✅ Decryption successful!');
		console.log(`📁 Output: ${result.outputPath}`);
	} catch (error) {
		console.log('❌ Decryption failed:', error.message);
	}
}

async function batchWorkflow(imageCipherFunctions, rl) {
	console.log('\n📦 Batch Processing Wizard');
	console.log('===========================\n');

	const directory = await askQuestion('Enter directory path: ', rl);

	if (!fs.existsSync(directory)) {
		console.log('❌ Directory not found!');
		return;
	}

	const operation = await askQuestion('Operation (encrypt/decrypt): ', rl);
	const recursive = await askQuestion('Process subdirectories? (y/n): ', rl);
	const outputDir = await askQuestion('Output directory (or press Enter for same): ', rl) || null;

	const options = {
		recursive: recursive.toLowerCase() === 'y',
		outputDir
	};

	try {
		console.log('\n🔄 Processing batch...');
		const results = await imageCipherFunctions.processBatch(directory, operation, options);

		const successful = results.filter(r => r.status === 'success').length;
		const failed = results.filter(r => r.status === 'error').length;

		console.log(`✅ Batch complete! ${successful} successful, ${failed} failed`);

		if (failed > 0) {
			console.log('\n❌ Failed files:');
			results.filter(r => r.status === 'error').forEach(r => {
				console.log(`  - ${path.basename(r.file)}: ${r.error}`);
			});
		}
	} catch (error) {
		console.log('❌ Batch processing failed:', error.message);
	}
}

async function startInteractiveMode(imageCipherFunctions) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	console.log('🎨 Welcome to ImageCipher Interactive Mode!');
	console.log('=====================================\n');

	try {
		const action = await askQuestion('What would you like to do?\n1. Encrypt an image\n2. Decrypt an image\n3. Batch process\n4. Exit\n\nChoice (1-4): ', rl);

		switch (action.trim()) {
			case '1':
				await encryptWorkflow(imageCipherFunctions, rl);
				break;
			case '2':
				await decryptWorkflow(imageCipherFunctions, rl);
				break;
			case '3':
				await batchWorkflow(imageCipherFunctions, rl);
				break;
			case '4':
				console.log('Goodbye! 👋');
				break;
			default:
				console.log('Invalid choice. Please try again.');
				await startInteractiveMode(imageCipherFunctions);
		}
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		rl.close();
	}
}

export {
	startInteractiveMode,
	encryptWorkflow,
	decryptWorkflow,
	batchWorkflow,
	askQuestion,
	generateSecurePassword
};
