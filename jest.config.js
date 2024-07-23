module.exports = {
  verbose: true,
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  testEnvironment: 'jsdom',
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  coveragePathIgnorePatterns: [
    '<rootDir>/spec'
  ],
  roots: ['./spec'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/spec/mocks/cssMock.js'
  }
}
