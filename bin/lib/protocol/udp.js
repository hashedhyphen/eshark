'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UDP = (function () {
  function UDP() {
    _classCallCheck(this, UDP);
  }

  _createClass(UDP, null, [{
    key: 'parse',
    value: function parse(reader) {
      return new Promise(function (resolve, reject) {
        if (reader.length < UDP.HEADER_LEN_MIN) {
          reject(Error('too short length for UDP'));
        }

        var source = reader.readUInt16BE(0),
            destination = reader.readUInt16BE(2),
            header_len = reader.readUInt16BE(4),
            checksum = '0x' + reader.toString('hex', 6, 8),
            payload = reader.length > UDP.HEADER_LEN_MIN ? reader.slice(UDP.HEADER_LEN_MIN) : null;

        resolve({
          core: {
            source: source, destination: destination, header_len: header_len, checksum: checksum
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

  return UDP;
})();

exports.default = UDP;