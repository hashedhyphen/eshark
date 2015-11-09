'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (reader) {
  return new Promise(function (resolve, reject) {
    var HEADER_LEN_MIN = 8;
    if (reader.length < HEADER_LEN_MIN) {
      reject(Error('too short length for UDP'));
    }

    var source = reader.buf.readUInt16BE(0),
        destination = reader.buf.readUInt16BE(2),
        header_len = reader.buf.readUInt16BE(4),
        checksum = '0x' + reader.toString('hex', 6, 8),
        data = reader.length > HEADER_LEN_MIN ? reader.slice(header_len) : null;

    resolve({ source: source, destination: destination, header_len: header_len, checksum: checksum, data: data });
  });
};