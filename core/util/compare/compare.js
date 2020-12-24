const compareHashes = require('./compare-hash');
const compareResemble = require('./compare-resemble');
const compareDiverged = require('./compare-diverged');
const { magickCompare, magickCompareRMSE } = require('./compare-imagemagick');
const storeFailedDiff = require('./store-failed-diff.js');

process.on('message', compare);

async function compare (data) {
  const { referencePath, testPath, pair, imageMagick, resembleOutputSettings, staticDiverged } = data;

  let testResult;

  try {
    if (imageMagick) {
      testResult = await magickCompareRMSE(referencePath, testPath, pair.misMatchThreshold);
    } else {
      testResule = await compareHashes(referencePath, testPath);
    }
    pair.diff = testResult;
    pair.status = 'pass';
  } catch (result) {
    if (imageMagick) {
      pair.diff = result;
      pair.status = 'fail';
      pair.diffImage = magickCompare(referencePath, testPath);
    } else {
      try {
        testResule = await compareResemble(referencePath, testPath, pair.misMatchThreshold, resembleOutputSettings, pair.requireSameDimensions);
        pair.diff = testResule;
        pair.status = 'pass';
      } catch (result) {
        pair.diff = result;
        pair.status = 'fail';
        pair.diffImage = await storeFailedDiff(testPath, result);
      }
    }
  }

  if (pair.status === 'fail' && staticDiverged) {
    pair.divergedDiffImage = compareDiverged(referencePath, testPath);
  }
  sendMessage(pair);
}

function sendMessage (data) {
  process.send(data);
}
