const compareHashes = require('./compare-hash');
const compareResemble = require('./compare-resemble');
const compareDiverged = require('./compare-diverged');
const { magickCompare, magickCompareRMSE } = require('./compare-imagemagick');
const storeFailedDiff = require('./store-failed-diff.js');

process.on('message', compare);

async function compare (data) {
  const { referencePath, testPath, pair, imageMagick, resembleOutputSettings, staticDiverged } = data;

  let testResult;

  if (imageMagick) {
    try {
      testResult = await magickCompareRMSE(referencePath, testPath, pair.misMatchThreshold);
      pair.diff = testResult;
      pair.status = 'pass';
    } catch (result) {
      pair.diff = result;
      pair.diffImage = magickCompare(referencePath, testPath);
      pair.status = 'fail';
      if (staticDiverged) {
        pair.divergedDiffImage = compareDiverged(referencePath, testPath);
      }
    }
  } else {
    try {
      testResule = await compareHashes(referencePath, testPath);
      pair.diff = testResult;
      pair.status = 'pass';
    } catch {
      try {
        testResule = await compareResemble(referencePath, testPath, pair.misMatchThreshold, resembleOutputSettings, pair.requireSameDimensions);
      } catch (result) {
        pair.diff = result;
        pair.status = 'fail';
        if (staticDiverged) {
          pair.divergedDiffImage = compareDiverged(referencePath, testPath);
        }
        const diffImage = await storeFailedDiff(testPath, data);
        pair.diffImage = diffImage;
      }
    }
  }
  sendMessage(pair);
}

function sendMessage (data) {
  process.send(data);
}
