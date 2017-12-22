const chalk = require('chalk');
const puppeteer = require('puppeteer');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  console.log();
  console.log(chalk.green('Setup Puppeteer Environment.'));
  const browser = await puppeteer.launch({
    args: ['about:blank'],
    executablePath: process.env.CHROME_BIN
  });
  global.browser = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};
