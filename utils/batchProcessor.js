import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Default options for batch processing
const DEFAULT_BATCH_OPTIONS = {
	recursive: false,
	filter: ['*.png', '*.jpg', '*.jpeg', '*.bmp', '*.gif'],
	outputDir: null
};

function isImageFile(filename) {
	const ext = path.extname(filename).toLowerCase();
	const allowedExts = ['.png', '.jpg', '.jpeg', '.bmp', '.gif'];
	return allowedExts.includes(ext);
}

function getOutputPath(inputFile, options = DEFAULT_BATCH_OPTIONS) {
	if (options.outputDir) {
		const basename = path.basename(inputFile);
		return path.join(options.outputDir, basename);
	}

	const parsed = path.parse(inputFile);
	return path.join(parsed.dir, `${parsed.name}_processed${parsed.ext}`);
}

async function getImageFiles(directory, options = DEFAULT_BATCH_OPTIONS, files = []) {
	const entries = await readdir(directory);

	for (const entry of entries) {
		const fullPath = path.join(directory, entry);
		const stats = await stat(fullPath);

		if (stats.isDirectory() && options.recursive) {
			await getImageFiles(fullPath, options, files);
		} else if (stats.isFile() && isImageFile(entry)) {
			files.push(fullPath);
		}
	}

	return files;
}

async function processDirectory(directory, operation, operationOptions = {}, batchOptions = DEFAULT_BATCH_OPTIONS) {
	const options = { ...DEFAULT_BATCH_OPTIONS, ...batchOptions };
	const files = await getImageFiles(directory, options);
	const results = [];

	console.log(`Found ${files.length} images to process...`);

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		console.log(`Processing ${i + 1}/${files.length}: ${path.basename(file)}`);

		try {
			const outputPath = getOutputPath(file, options);
			await operation(file, outputPath, operationOptions);
			results.push({ file, status: 'success', outputPath });
		} catch (error) {
			console.error(`Error processing ${file}:`, error.message);
			results.push({ file, status: 'error', error: error.message });
		}
	}

	return results;
}

export {
	processDirectory,
	getImageFiles,
	getOutputPath,
	isImageFile,
	DEFAULT_BATCH_OPTIONS
};
