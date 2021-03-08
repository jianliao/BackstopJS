const compareHashes = require('./compare-hash');
const compareResemble = require('./compare-resemble');
const compareDiverged = require('./compare-diverged');
const { magickCompare, magickCompareRMSE } = require('./compare-imagemagick');
const storeFailedDiff = require('./store-failed-diff.js');

process.on('message', compare);

async function compare (data) {
  const { referencePath, testPath, pair, imageMagick, resembleOutputSettings, staticDiverged } = data;

  try {
    try {
      if (imageMagick) {
        pair.diff = await magickCompareRMSE(referencePath, testPath, pair.misMatchThreshold);
      } else {
        pair.diff = await compareHashes(referencePath, testPath);
      }
      pair.status = 'pass';
    } catch (result) {
      if (imageMagick) {
        pair.diff = result;
        pair.status = 'fail';
        pair.diffImage = magickCompare(referencePath, testPath);
      } else {
        try {
          pair.diff = await compareResemble(referencePath, testPath, pair.misMatchThreshold, resembleOutputSettings, pair.requireSameDimensions);
          pair.status = 'pass';
        } catch (result2) {
          pair.diff = result2;
          pair.status = 'fail';
          pair.diffImage = await storeFailedDiff(testPath, result2);
        }
      }
    }

    if (pair.status === 'fail' && staticDiverged) {
      pair.divergedDiffImage = compareDiverged(referencePath, testPath);
    }
    process.send(pair);
  } finally {
    process.exit();
  }
}
