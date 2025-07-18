#!/usr/bin/env node

import init from './utils/init.js';
import cli from './utils/cli.js';
import encrypt from './utils/encrypt.js';
import decrypt from './utils/decrypt.js';

const input = cli.input;
const flags = cli.flags;
const { clear } = flags;

(async () => {
	init({ clear });

	input.includes(`help`) && cli.showHelp(0);
	// check if encrypt is present in flags object
	if (flags.encrypt) {
		await encrypt(flags);
	} else if (flags.decrypt) {
		await decrypt(flags);
	}

	// footer to show when the program is finished

	const chalk = (await import(`chalk`)).default;

	// print Give it a star on github message
	console.log(
		chalk.bgMagenta(` Give it a star on github: `) +
			chalk.bold(` https://github.com/AdityaKrSingh26/ImageCipher `)
	);
})();