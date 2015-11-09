'use strict';

var _router = require('../../bin/router.js');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var file_path = process.argv[2];

(0, _router2.default)(file_path).then(function (buf) {
  console.log('resolved:');
  console.log(buf);
}).catch(function (err) {
  console.error('rejected:');
  console.error(err);
});