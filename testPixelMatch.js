const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

const img1 = PNG.sync.read(fs.readFileSync('image1.png'));
const img2 = PNG.sync.read(fs.readFileSync('image2.png'));

const { width: width1, height: height1 } = img1;
const { width: width2, height: height2 } = img2;

console.log(`width1 = ${width1}; height1 = ${height1}`);
console.log(`width2 = ${width2}; height2 = ${height2}`);

const diff = new PNG({ width: width2, height: height2 });

const croppedImage = new PNG({ width: width2, height: height2 });

PNG.bitblt(img1, croppedImage, 0, 0, width2, height2, 0, 0);

pixelmatch(croppedImage.data, img2.data, diff.data, width2, height2, { threshold: 0.1, alpha: 1 });

fs.writeFileSync('diff.png', PNG.sync.write(diff));
