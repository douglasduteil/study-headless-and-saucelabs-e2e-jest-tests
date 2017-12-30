//

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const assert = require('assert');

const username = process.env.SAUCE_USERNAME;
const accessKey = process.env.SAUCE_ACCESS_KEY;
const server = 'http://ondemand.saucelabs.com:80/wd/hub';

(async function({ capabilities_file, output_dir, specs_dir }) {
  assert(
    capabilities_file,
    'Should provide a <capabilities_files> (.json or .js)'
  );
  const capabilities = require(path.resolve(process.cwd(), capabilities_file));
  assert(
    Array.isArray(capabilities),
    'The <capabilities_files> should contain an array of capabilities'
  );

  await fs.ensureDir(output_dir);

  await Promise.all(
    capabilities.map(async cap => {
      const cap_dir = path.join(output_dir, cap.name);
      await fs.copy(specs_dir, cap_dir);
      await fs.writeJson(path.join(cap_dir, 'capability.json'), {
        ...cap,
        build:
          process.env.BUILD_NUMBER ||
          process.env.BUILD_TAG ||
          process.env.CI_BUILD_NUMBER ||
          process.env.CI_BUILD_TAG ||
          process.env.TRAVIS_BUILD_NUMBER ||
          process.env.CIRCLE_BUILD_NUM ||
          process.env.DRONE_BUILD_NUMBER,
        username,
        accessKey,
        server
      });
    })
  );
})({
  capabilities_file: './tests/e2e/webdriverio/saucelab_capabilities.json',
  specs_dir: './tests/e2e/webdriverio/specs',
  output_dir: './tests/e2e/webdriverio/out'
});
