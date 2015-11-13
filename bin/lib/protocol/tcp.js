'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TCP = (function () {
  function TCP() {
    _classCallCheck(this, TCP);
  }

  _createClass(TCP, null, [{
    key: 'parse',
    value: function parse(reader) {
      return new Promise(function (resolve, reject) {
        if (reader.length < TCP.HEADER_LEN_MIN) {
          reject(new Error('too short length for TCP'));
        }

        var source = reader.readUInt16BE(0),
            destination = reader.readUInt16BE(2),
            seq_num = reader.readUInt32BE(4),
            ack_num = reader.readUInt32BE(8),
            header_len = (reader.readUInt8(12) >>> 4) * 4,
            flags = TCP.getTCPFlags(reader.readUInt8(13) & 0x3f),
            window_size = reader.readUInt16BE(14),
            checksum = '0x' + reader.toString('hex', 16, 18),
            urgent_ptr = reader.readUInt16BE(18),
            options = /*(header_len == HEADER_LEN_MIN) ?*/null,
            payload = reader.length > TCP.HEADER_LEN_MIN ? reader.slice(header_len) : null;

        resolve({
          core: {
            source: source, destination: destination, seq_num: seq_num, ack_num: ack_num, header_len: header_len, flags: flags,
            window_size: window_size, checksum: checksum, urgent_ptr: urgent_ptr, options: options
          },
          next: {
            protocol: null,
            payload: payload
          }
        });
      });
    }
  }, {
    key: 'getTCPFlags',
    value: function getTCPFlags(bits) {
      return {
        urg: +!!(bits & 0x20), ack: +!!(bits & 0x10),
        psh: +!!(bits & 0x08), rst: +!!(bits & 0x04),
        syn: +!!(bits & 0x02), fin: +!!(bits & 0x01)
      };
    }
  }, {
    key: 'HEADER_LEN_MIN',
    get: function get() {
      return 20;
    }
  }]);

  return TCP;
})();

exports.default = TCP;