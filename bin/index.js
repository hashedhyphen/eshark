'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _libPcapng_parserJs = require('./lib/pcapng_parser.js');

var _libPcapng_parserJs2 = _interopRequireDefault(_libPcapng_parserJs);

var readFile = function readFile(file_path) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].readFile(file_path, function (err, buf) {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    });
  });
};

var createParser = function createParser(buf) {
  return new Promise(function (resolve, reject) {
    resolve(new _libPcapng_parserJs2['default'](buf));
  });
};

exports['default'] = function (file_path) {
  return new Promise(function (resolve, reject) {
    readFile(file_path).then(function (buf) {
      resolve(new _libPcapng_parserJs2['default'](buf));
    }).then(function (parser) {
      resolve(42);
    })['catch'](function (err) {
      reject(err);
    });
  });
};

module.exports = exports['default'];