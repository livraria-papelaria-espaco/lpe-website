module.exports = {
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/tests/assetsTransformer.js',
    '\\.(css|less)$': '<rootDir>/tests/assetsTransformer.js',
  },
};
