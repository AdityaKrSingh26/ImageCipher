import crypto from 'crypto';

// Default options for password encryption
const DEFAULT_OPTIONS = {
	algorithm: 'aes-256-gcm',
	keyLength: 32,
	iterations: 100000,
	tagLength: 16
};

function deriveKey(password, salt, options = DEFAULT_OPTIONS) {
	return crypto.pbkdf2Sync(password, salt, options.iterations, options.keyLength, 'sha512');
}

function encryptWithPassword(data, password, options = DEFAULT_OPTIONS) {
	// Generate random salt and IV
	const salt = crypto.randomBytes(32);
	const iv = crypto.randomBytes(16);

	// Derive key from password
	const key = deriveKey(password, salt, options);

	// Create cipher using createCipheriv
	const cipher = crypto.createCipheriv(options.algorithm, key, iv);

	// Encrypt data
	let encrypted = cipher.update(data);
	encrypted = Buffer.concat([encrypted, cipher.final()]);

	// Get authentication tag after final() is called
	const tag = cipher.getAuthTag();

	// Combine salt + iv + tag + encrypted data
	return Buffer.concat([
		salt,           // 32 bytes
		iv,             // 16 bytes  
		tag,            // 16 bytes
		encrypted       // variable length
	]);
}

function decryptWithPassword(encryptedData, password, options = DEFAULT_OPTIONS) {
	// Extract components
	const salt = encryptedData.slice(0, 32);
	const iv = encryptedData.slice(32, 48);
	const tag = encryptedData.slice(48, 64);
	const encrypted = encryptedData.slice(64);

	// Derive key from password
	const key = deriveKey(password, salt, options);

	// Create decipher using createDecipheriv
	const decipher = crypto.createDecipheriv(options.algorithm, key, iv);
	decipher.setAuthTag(tag);

	// Decrypt data
	let decrypted = decipher.update(encrypted);
	decrypted = Buffer.concat([decrypted, decipher.final()]);

	return decrypted;
}

// Generate secure random password
function generateSecurePassword(length = 32) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
	let password = '';
	for (let i = 0; i < length; i++) {
		password += chars.charAt(crypto.randomInt(0, chars.length));
	}
	return password;
}

export {
	encryptWithPassword,
	decryptWithPassword,
	generateSecurePassword,
	deriveKey,
	DEFAULT_OPTIONS
};
