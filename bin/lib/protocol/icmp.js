'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ICMP = (function () {
  function ICMP() {
    _classCallCheck(this, ICMP);
  }

  _createClass(ICMP, null, [{
    key: 'parse',
    value: function parse(reader) {
      return new Promise(function (resolve, reject) {
        if (reader.length < ICMP.HEADER_LEN_MIN) {
          reject(new Error('too short length for ICMP'));
        }

        var type = reader.readUInt8(0),
            code = reader.readUInt8(1),
            checksum = '0x' + reader.toString('hex', 2, 4),
            id = reader.readUInt16BE(4),
            sequence = reader.readUInt16BE(6),
            payload = reader.length > ICMP.HEADER_LEN_MIN ? reader.toString('utf8', ICMP.HEADER_LEN_MIN) : null;

        resolve({
          core: {
            type: type, code: code, checksum: checksum, id: id, sequence: sequence
          },
          next: {
            protocol: null,
            payload: payload
          }
        });
      });
    }
  }, {
    key: 'HEADER_LEN_MIN',
    get: function get() {
      return 8;
    }
  }]);

  return ICMP;
})();

exports.default = ICMP;