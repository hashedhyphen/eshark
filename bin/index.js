'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _libPcapng_parserJs = require('./lib/pcapng_parser.js');

var _libPcapng_parserJs2 = _interopRequireDefault(_libPcapng_parserJs);

var createParser = function createParser(file_path) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].readFile(file_path, function (err, buf) {
      if (err) {
        reject(err);
      } else {
        resolve(new _libPcapng_parserJs2['default'](buf));
      }
    });
  });
};

exports['default'] = function (file_path) {
  return new Promise(function (resolve, reject) {
    createParser(file_path).then(function (parser) {
      resolve(parser.parse());
    })['catch'](function (err) {
      reject(err);
    });
  });
};

module.exports = exports['default'];