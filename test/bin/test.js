'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _binRouterJs = require('../../bin/router.js');

var _binRouterJs2 = _interopRequireDefault(_binRouterJs);

var file_path = process.argv[2];

(0, _binRouterJs2['default'])(file_path).then(function (buf) {
  console.log('resolved:');
  console.log(buf);
})['catch'](function (err) {
  console.error('rejected:');
  console.error(err);
});