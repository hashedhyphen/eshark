'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _pcap_parser = require('./pcap_parser.js');

var _pcap_parser2 = _interopRequireDefault(_pcap_parser);

var _pcapng_parser = require('./pcapng_parser.js');

var _pcapng_parser2 = _interopRequireDefault(_pcapng_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var readFile = function readFile(file_path) {
  return new Promise(function (resolve, reject) {
    _fs2.default.readFile(file_path, function (err, buf) {
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
    var leader = buf.toString('hex', 0, 4);
    switch (leader) {
      case '0a0d0d0a':
        resolve(new _pcapng_parser2.default(buf));
        break;
      case 'd4c3b2a1':
      case 'a1b2c3d4':
        resolve(new _pcap_parser2.default(buf));
        break;
      default:
        reject(new Error({ msg: 'unknown magic number' }));
    }
  });
};

exports.default = function (file_path) {
  return new Promise(function (resolve, reject) {
    readFile(file_path).then(createParser).then(function (parser) {
      resolve(parser.parse());
    }).catch(function (err) {
      reject(err);
    });
  });
};