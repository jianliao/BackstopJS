const PNG = require('pngjs').PNG;
const fs = require('fs');
const path = require('path');
const diverged = require('../../../compare/output/diverged');

function getFailedDiffFilename (testPath) {
  return `${path.dirname(testPath) + path.sep}failed_diverged_diff_${path.basename(testPath)}`;
}

function divergedCompare (referencePath, testPath) {
  const referenceImage = PNG.sync.read(fs.readFileSync(referencePath));
  const testImage = PNG.sync.read(fs.readFileSync(testPath));

  const divergedDiffData = diverged(referenceImage.data, testImage.data, referenceImage.height, referenceImage.width);

  const diff = new PNG({ width: testImage.width, height: testImage.height });

  diff.data = divergedDiffData;

  const failedDiffFilename = getFailedDiffFilename(testPath);

  fs.writeFileSync(failedDiffFilename, PNG.sync.write(diff));

  return failedDiffFilename;
}

module.exports = divergedCompare;
