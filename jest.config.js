module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Test file patterns
  testMatch: [
    '**/test/**/*.test.js',
    '**/tests/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
  ],

  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'scripts/**/*.js',
    'blocks/**/*.js',
    '!**/node_modules/**',
    '!**/test/**',
    '!**/tests/**',
    '!**/__tests__/**',
    '!**/coverage/**',
    '!jest.config.js',
    '!.eslintrc.js',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },

  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],

  // Module file extensions
  moduleFileExtensions: ['js', 'json'],

  // Clear mocks automatically between every test
  clearMocks: true,

  // Test timeout
  testTimeout: 10000,

  // Transform configuration for ES modules
  transform: {
    '^.+\\.js$': 'babel-jest',
  },

  // Babel configuration
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
};