module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts', '**/__tests__/**/*.test.ts'],
  verbose: true,
  roots: ['<rootDir>/tests'],
  // Run a global setup to ensure all models are registered and tables created
  globalSetup: '<rootDir>/tests/jest.global-setup.ts',
  globalTeardown: '<rootDir>/tests/jest.global-teardown.ts'
};
