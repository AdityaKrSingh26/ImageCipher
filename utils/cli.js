import meow from 'meow';
import meowHelp from 'cli-meow-help';

const flags = {
	encrypt: {
		type: `string`,
		desc: `The image to encrypt`,
		alias: `e`
	},
	decrypt: {
		type: `string`,
		desc: `The image to decrypt`,
		alias: `d`
	},
	password: {
		type: `string`,
		desc: `Use password-based encryption/decryption`,
		alias: `p`
	},
	generatePassword: {
		type: `boolean`,
		desc: `Generate a secure random password`,
		alias: `g`
	},
	batch: {
		type: `string`,
		desc: `Process directory in batch mode`,
		alias: `b`
	},
	operation: {
		type: `string`,
		desc: `Batch operation: encrypt or decrypt`,
		alias: `op`
	},
	recursive: {
		type: `boolean`,
		desc: `Process subdirectories recursively`,
		alias: `r`
	},
	interactive: {
		type: `boolean`,
		desc: `Launch interactive mode`,
		alias: `i`
	},
	analyze: {
		type: `string`,
		desc: `Analyze image properties`,
		alias: `a`
	},
	outputImageFileName: {
		type: `string`,
		desc: `The output image file name`,
		alias: `o`
	},
	outputKeyFileName: {
		type: `string`,
		desc: `The output key file name`,
		alias: `ok`
	},
	key: {
		type: `string`,
		desc: `The key file to use for decryption`,
		alias: `k`
	},
	outputDir: {
		type: `string`,
		desc: `Output directory for batch processing`,
		alias: `od`
	},
	format: {
		type: `string`,
		desc: `Output image format (png, jpg, webp)`,
		alias: `f`
	},
	quality: {
		type: `number`,
		desc: `Image quality (1-100)`,
		alias: `q`
	},
	algorithm: {
		type: `string`,
		desc: `Encryption algorithm (xor, aes)`,
		alias: `alg`
	},
	clear: {
		type: `boolean`,
		default: false,
		alias: `c`,
		desc: `Clear the console`
	},
	noClear: {
		type: `boolean`,
		default: true,
		desc: `Don't clear the console`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `imagecipher`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

const cli = meow(helpText, options);

// adding commands
cli.commands = commands;

export default cli;