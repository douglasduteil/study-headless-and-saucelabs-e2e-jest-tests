//

const { launch } = require('jest-environment-puppeteer');

module.exports = async function() {
  return launch({
    args: ['about:blank'],
    executablePath: process.env.CHROME_BIN,
    headless: false
  });
};
