module.exports = {
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/',
  ],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
};