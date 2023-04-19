module.exports = {
  name: 'ice-custom-components',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ice-custom-components',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
