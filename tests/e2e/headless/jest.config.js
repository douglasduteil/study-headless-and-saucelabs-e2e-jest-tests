module.exports = {
  bail: true,
  globals: {
    'ts-jest': {
      tsConfigFile: '<rootDir>/../tsconfig.json'
    }
  },
  globalSetup: '<rootDir>/headless/setup.js',
  globalTeardown: '<rootDir>/headless/teardown.js',
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  testEnvironment: '<rootDir>/headless/puppeteer_environment.js',
  testEnvironmentOptions: {
    headless: false
  },
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  mapCoverage: true,
  rootDir: require('path').resolve(__dirname, '..'),
  roots: ['<rootDir>/headless/specs'],
  verbose: true
};
