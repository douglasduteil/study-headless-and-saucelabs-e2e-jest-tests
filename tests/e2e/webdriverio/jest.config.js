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
