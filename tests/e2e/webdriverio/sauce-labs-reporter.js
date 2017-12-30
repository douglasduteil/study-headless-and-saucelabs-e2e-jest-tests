const sauceLabs = require('saucelabs');
const { readFileSync } = require('fs');
const { join, dirname } = require('path');

class SauceLabsReporter {
  onTestResult(config, result, results) {
    const passed = result.numFailingTests === 0;

    const sauceLabsAccount = new sauceLabs({
      password: process.env.SAUCE_ACCESS_KEY,
      username: process.env.SAUCE_USERNAME
    });

    const sessionId = readFileSync(
      join(dirname(result.testFilePath), 'session')
    );

    sauceLabsAccount.updateJob(sessionId, { passed }, err => {
      if (err) {
        console.error();
        console.error(err);
      }
    });
  }
}

module.exports = SauceLabsReporter;
