//

const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');

const chalk = require('chalk');
const puppeteer = require('puppeteer');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

module.exports = launch.bind(null, {});

module.exports.launch = launch;

/**
 * Launch the environment
 * @param { LaunchOptions } options
 */
async function launch(options) {
  console.log();
  console.log(chalk.green('Setup Puppeteer Environment.'));

  const browser = await puppeteer.launch(options);

  global.browser = browser;
  mkdirp.sync(DIR);
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
}
