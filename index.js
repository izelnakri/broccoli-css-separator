const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const Writer = require('broccoli-caching-writer');
const walkSync = require('walk-sync'); // maybe remove
const separator = require('postcss-separator');

Separator.prototype = Object.create(Writer.prototype);
Separator.prototype.constructor = Separator;
Separator.prototype.build = function() {
	const srcDir = this.inputPaths[0];
	const destDir = this.outputPath;
	const paths = walkSync(srcDir);

	return paths.forEach((relativePath) => {
		if (/\/$/.test(relativePath)) {
			mkdirp.sync(`${destDir}/${relativePath}`);
		} else if (/\.css$/.test(relativePath)) {
			const srcPath = path.join(srcDir, relativePath);
			const rawcss = fs.readFileSync(srcPath, { encoding: 'utf8' });

			const data = separator.separate(rawcss, { dataFile: true });
			const original = separator.separate(rawcss, { dataFile: false });

			if (data.css) { // write files overwriting originals + data (if there is any data)
				const destPath = path.join(destDir, relativePath);
				const dataDestPath = destPath.replace(/\.css$/, '-uris.css');

				fs.writeFileSync(destPath, original.css, { encoding: 'utf8' });
				fs.writeFileSync(dataDestPath, data.css, { encoding: 'utf8' });
			}
		}
	});
}

function Separator(inputTree, options={}) {
	if (!Array.isArray(inputTree)) {
		return Writer.call(this, [inputTree], options);
	}

	return Writer.call(this, inputTree, options);
};

module.exports = Separator;
