'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

exports['default'] = function (file_name) {
  _fs2['default'].readFile(file_name, function (err, buf) {
    if (err) console.error(err);
    return console.log(buf);
  });
};

module.exports = exports['default'];