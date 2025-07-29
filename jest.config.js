import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [
    '/node_modules/(?!(next|@mui|lucide-react)/)',
  ],
  moduleNameMapper: {
    '^next/image$': '<rootDir>/__mocks__/nextImageMock.js',
  },
};

export default createJestConfig(customJestConfig);