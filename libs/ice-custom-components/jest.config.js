module.exports = {
  name: 'ice-custom-components',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ice-custom-components',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
