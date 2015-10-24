'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _binIndexJs = require('../../bin/index.js');

var _binIndexJs2 = _interopRequireDefault(_binIndexJs);

var file_path = process.argv[2];

(0, _binIndexJs2['default'])(file_path).then(function (buf) {
  console.log('resolved:');
  console.log(buf);
})['catch'](function (err) {
  console.error('error:');
  console.error(err);
});