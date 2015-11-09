'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (reader, start, cap_len) {
  var packet = reader.slice(start, start + cap_len);
  return packet.toString('hex');
};