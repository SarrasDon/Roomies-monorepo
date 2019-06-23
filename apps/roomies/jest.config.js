module.exports = {
  name: 'roomies',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/roomies',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
