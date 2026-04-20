import sharp from 'sharp';
import path from 'path';

const DEFAULT_IMAGE_OPTIONS = {
	outputFormat: null,
	quality: 90,
	compression: 6,
	preserveMetadata: false
};

function generateImageOutputPath(inputPath, format) {
	const parsed = path.parse(inputPath);
	const ext = format === 'jpeg' ? 'jpg' : format;
	return path.join(parsed.dir, `${parsed.name}_processed.${ext}`);
}

async function analyzeImage(imagePath, options = DEFAULT_IMAGE_OPTIONS) {
	const image = sharp(imagePath);
	const [metadata, stats] = await Promise.all([image.metadata(), image.stats()]);

	const entropy = stats.channels.reduce((sum, ch) => sum + ch.entropy, 0) / stats.channels.length;
	const colorProfile = metadata.icc ? 'ICC' : metadata.space || 'None';

	return {
		metadata: {
			format: metadata.format,
			size: metadata.size,
			channels: metadata.channels,
			space: metadata.space,
			width: metadata.width,
			height: metadata.height
		},
		stats,
		entropy,
		colorProfile
	};
}

async function convertImageFormat(inputPath, outputFormat, options = {}) {
	const outputPath = generateImageOutputPath(inputPath, outputFormat);
	const quality = options.quality || DEFAULT_IMAGE_OPTIONS.quality;

	await sharp(inputPath)
		.toFormat(outputFormat, { quality })
		.toFile(outputPath);

	return outputPath;
}

export {
	analyzeImage,
	convertImageFormat,
	generateImageOutputPath,
	DEFAULT_IMAGE_OPTIONS
};
