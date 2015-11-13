'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IPv4 = (function () {
  function IPv4() {
    _classCallCheck(this, IPv4);
  }

  _createClass(IPv4, null, [{
    key: 'parse',
    value: function parse(reader) {
      return new Promise(function (resolve, reject) {
        if (reader.length < IPv4.HEADER_LEN_MIN) {
          reject(new Error('too short length for IPv4'));
        }

        var version = reader.readUInt8(0) >>> 4,
            ihl = (reader.readUInt8() & 0xf) * 4 // in bytes
        ,
            service = '0x' + reader.toString('hex', 1, 2),
            total_len = reader.readUInt16BE(3),
            id = '0x' + reader.toString('hex', 4, 6),
            flags = reader.readUInt8(6) >>> 5,
            offset = (reader.readUInt8(6) & 0x1) * 0x100 + reader.readUInt8(7),
            ttl = reader.readUInt8(8),
            protocol = IPv4.PROTOCOLS.get(reader.readUInt8(9)),
            checksum = '0x' + reader.toString('hex', 10, 12),
            source = IPv4.getIPv4Address(reader, 12),
            destination = IPv4.getIPv4Address(reader, 16),
            payload = reader.length > IPv4.HEADER_LEN_MIN ? reader.slice(ihl) : null;

        resolve({
          core: {
            version: version, ihl: ihl, service: service, total_len: total_len, id: id, flags: flags, offset: offset,
            ttl: ttl, protocol: protocol, checksum: checksum, source: source, destination: destination
          },
          next: {
            protocol: protocol,
            payload: payload
          }
        });
      });
    }
  }, {
    key: 'getIPv4Address',
    value: function getIPv4Address(reader, offset) {
      var chunk = reader.buf.slice(offset, offset + 4),
          bytes = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chunk.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    }
  }, {
    key: 'HEADER_LEN_MIN',
    get: function get() {
      return 20;
    }
  }, {
    key: 'PROTOCOLS',
    get: function get() {
      return new Map([[1, 'ICMP'], [6, 'TCP'], [17, 'UDP']]);
    }
  }]);

  return IPv4;
})();

exports.default = IPv4;