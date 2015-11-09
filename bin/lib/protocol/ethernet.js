'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (reader) {
  return new Promise(function (resolve, reject) {
    var HEADER_LEN = 14;
    if (reader.length < HEADER_LEN) {
      reject(Error('too short length for Ethernet'));
    }

    var destination = getMACAddress(reader, 0),
        source = getMACAddress(reader, 6),
        ether_type = ETHER_TYPES.get(reader.toString('hex', 12, 14)),
        payload = reader.length > HEADER_LEN ? reader.slice(14) : null;

    resolve({ destination: destination, source: source, ether_type: ether_type, payload: payload });
  });
};

var getMACAddress = function getMACAddress(reader, start) {
  var chunk = reader.buf.slice(start, start + 6),
      bytes = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = chunk[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var b = _step.value;

      var hex = b.toString(16);
      bytes.push(b < 0x10 ? '0' + hex : hex);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return bytes.join(':');
};

var ETHER_TYPES = new Map([['0800', 'Internet Protocol Version 4'], ['86dd', 'Internet Protocol Version 6']]);