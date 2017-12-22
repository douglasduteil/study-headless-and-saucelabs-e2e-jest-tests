//

const os = require('os');
const path = require('path');

const chalk = require('chalk');
const puppeteer = require('puppeteer');
const del = require('del');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = async function() {
  console.log();
  console.log(chalk.green('Teardown Puppeteer Environment.'));
  await global.browser.close();
  del.sync(DIR, { force: true });
};
