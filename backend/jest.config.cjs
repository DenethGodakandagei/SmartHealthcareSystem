/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/src'], // 👈 ensures Jest looks for files starting in /src
  moduleDirectories: ['node_modules', 'src'], // 👈 allows imports like "@/services/record.service"
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest', // 👈 ensures TS files are transformed
  },
};
