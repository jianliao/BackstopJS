const compareHashes = require('./compare-hash');
const compareResemble = require('./compare-resemble');
const compareDiverged = require('./compare-diverged');
const { magickCompare, magickCompareRMSE } = require('./compare-imagemagick');
const storeFailedDiff = require('./store-failed-diff.js');

process.on('message', compare);

function compare (data) {
  const { referencePath, testPath, resembleOutputSettings, pair } = data;

  const isStaticDiverged = !!resembleOutputSettings && !!(resembleOutputSettings.diverged);
  const isMagick = !!resembleOutputSettings && !!(resembleOutputSettings.magick);

  if (isMagick) {
    magickCompareRMSE(referencePath, testPath, pair.misMatchThreshold)
      .then(data => {
        pair.diff = data;
        pair.status = 'pass';
        return sendMessage(pair);
      })
      .catch(data => {
        pair.diff = data;
        pair.diffImage = magickCompare(referencePath, testPath);
        pair.status = 'fail';
        if (isStaticDiverged) {
          pair.divergedDiffImage = compareDiverged(referencePath, testPath);
        }
        return sendMessage(pair);
      });
  } else {
    const promise = compareHashes(referencePath, testPath)
      .catch(() => compareResemble(referencePath, testPath, pair.misMatchThreshold, resembleOutputSettings, pair.requireSameDimensions));

    promise
      .then(function (data) {
        pair.diff = data;
        pair.status = 'pass';
        return sendMessage(pair);
      })
      .catch(function (data) {
        pair.diff = data;
        pair.status = 'fail';
        if (isStaticDiverged) {
          pair.divergedDiffImage = compareDiverged(referencePath, testPath);
        }
        return storeFailedDiff(testPath, data).then(function (compare) {
          pair.diffImage = compare;
          return sendMessage(pair);
        });
      });
  }
}

function sendMessage (data) {
  process.send(data);
}
