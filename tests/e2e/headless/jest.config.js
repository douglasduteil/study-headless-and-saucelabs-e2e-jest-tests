module.exports = {
  bail: true,
  globals: {
    'ts-jest': {
      tsConfigFile: './tsconfig.json'
    }
  },
  globalSetup: './setup.js',
  globalTeardown: 'jest-environment-puppeteer/teardown.js',
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  testEnvironment: 'jest-environment-puppeteer',
  testEnvironmentOptions: {
    headless: false
  },
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  mapCoverage: true,
  roots: ['./specs'],
  verbose: true
};
