module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.json'
    }
  },
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  //testEnvironment: 'jest-environment-webdriverio',
  // testEnvironmentOptions: saucelab(),
  reporters: ['default'].concat(
    process.env.SAUCE_USERNAME ? ['./sauce-labs-reporter.js'] : []
  ),
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  mapCoverage: true,
  rootDir: __dirname,
  roots: [process.env.SAUCE_USERNAME ? './out' : './specs']
};

function local() {
  return {
    desiredCapabilities: {
      browserName: 'firefox',
      'moz:firefoxOptions': { args: ['-headless'] }
    }
  };
}

function saucelab() {
  //const saucelabCapabilities = require('./saucelab_capabilities.json');
  const saucelabCapabilities = [
    {
      browserName: 'android',
      platform: 'Linux',
      version: '4.4',
      name: 'Android Emulator 4.4'
    }
  ];
  const capabilities = saucelabCapabilities.reduce(
    (memo, c) =>
      Object.assign(memo, {
        [c.name]: {
          desiredCapabilities: c,

          host: 'ondemand.saucelabs.com',
          key: process.env.SAUCE_ACCESS_KEY,
          port: 80,
          user: process.env.SAUCE_USERNAME
        }
      }),
    {}
  );
  return {
    capabilities
  };
}
