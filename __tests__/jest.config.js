module.exports = {
  globals: {
    'ts-jest': {
      tsConfigFile: './__tests__/tsconfig.json'
    }
  },
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  mapCoverage: true,
  moduleNameMapper: {
    '^src/(.*)': '<rootDir>/../src/$1'
  }
};
