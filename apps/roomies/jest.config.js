module.exports = {
  name: 'roomies',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/roomies',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
