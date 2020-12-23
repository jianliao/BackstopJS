const path = require('path');
const { spawnSync } = require('child_process');

function getFailedDiffFilename (testPath) {
  return `${path.dirname(testPath) + path.sep}failed_magick_diff_${path.basename(testPath)}`;
}

/*
  https://stackoverflow.com/a/33673440/2695637
  Convert both file1.png and file2.png to grayscale. Then trat the first as the red channel of the resulting image, the second as the green channel. The blue channel is formed from these two using the darken compose operator, which essentially means taking the minimum.

  So things which are white in both images stay white. Things which are black in both images stay black. Things which are white in the first image but black in the second turn red, and things which are white in the second but black in the first turn green.

  The result gives you a nicely color-coded image where you can easily associate green with the first input and red with the second.
*/
function getGenereateDiffShellCommand (reference, test, diff) {
  return `magick convert '(' ${reference} -flatten -grayscale Rec709Luminance ')' \
          '(' ${test} -flatten -grayscale Rec709Luminance ')' \
          '(' -clone 0-1 -compose darken -composite ')' \
          -channel RGB -combine ${diff}`;
}

function getDifferenceRatioCommand (reference, test) {
  return `magick compare -metric RMSE ${reference} ${test} NULL:`;
}

function magickCompare (referencePath, testPath) {
  const failedDiffFilename = getFailedDiffFilename(testPath);

  spawnSync(getGenereateDiffShellCommand(referencePath, testPath, failedDiffFilename), { stdio: 'inherit', shell: true });

  return failedDiffFilename;
}

function magickCompareRMSE (referencePath, testPath, threshold = 0) {
  return new Promise((resolve, reject) => {
    const hrstart = process.hrtime();
    const { stderr } = spawnSync(getDifferenceRatioCommand(referencePath, testPath), { shell: true });
    const hrend = process.hrtime(hrstart);
    const out = stderr.toString();
    const misMatchPercentage = out.substring(out.indexOf('(') + 1, out.length - 1) * 100;
    const result = {
      isSameDimensions: false,
      dimensionDifference: {
        width: 0,
        height: 0
      },
      misMatchPercentage,
      analysisTime: `${hrend[0]}s ${hrend[1] / 1000000}ms`
    };
    if (misMatchPercentage < threshold) {
      result.isSameDimensions = true;
      resolve(result);
    } else {
      reject(result);
    }
  });
}

module.exports = {
  magickCompare: magickCompare,
  magickCompareRMSE: magickCompareRMSE
};
