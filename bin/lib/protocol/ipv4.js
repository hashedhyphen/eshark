'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (reader) {
  return new Promise(function (resolve, reject) {
    var HEADER_LEN = 20;
    if (reader.length < HEADER_LEN) {
      reject(new Error('too short length for IPv4'));
    }

    var version = reader.readUInt8(0) >>> 4,
        ihl = (reader.readUInt8() & 0xf) * 4 // in bytes
    ,
        service = '0x' + reader.toString('hex', 1, 2),
        total_len = reader.readUInt16(3),
        id = '0x' + reader.toString('hex', 4, 6),
        flags = reader.readUInt8(6) >>> 5,
        offset = (reader.readUInt8(6) & 0x1) * 0x100 + reader.readUInt8(7),
        ttl = reader.readUInt8(8),
        protocol = PROTOCOLS.get(reader.readUInt8(9)),
        checksum = '0x' + reader.toString('hex', 10, 12),
        source = getIPv4Address(reader, 12),
        destination = getIPv4Address(reader, 16),
        payload = reader.length > HEADER_LEN ? reader.slice(ihl) : null;

    resolve({ version: version, ihl: ihl, service: service, total_len: total_len, id: id,
      flags: flags, offset: offset, ttl: ttl, protocol: protocol, checksum: checksum,
      source: source, destination: destination, payload: payload });
  });
};

var getIPv4Address = function getIPv4Address(reader, start) {
  var chunk = reader.buf.slice(start, start + 4),
      bytes = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = chunk[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var b = _step.value;
      bytes.push(b);
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

  return bytes.join('.');
};

var PROTOCOLS = new Map([[1, 'ICMP'], [6, 'TCP'], [17, 'UDP']]);