'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Ethernet = (function () {
  function Ethernet() {
    _classCallCheck(this, Ethernet);
  }

  _createClass(Ethernet, null, [{
    key: 'parse',
    value: function parse(reader) {
      return new Promise(function (resolve, reject) {
        if (reader.length < Ethernet.HEADER_LEN_MIN) {
          reject(Error('too short length for Ethernet'));
        }

        var destination = Ethernet.getMACAddress(reader, 0),
            source = Ethernet.getMACAddress(reader, 6),
            ether_type = Ethernet.ETHER_TYPES.get(reader.readUInt16BE(12)),
            payload = reader.length > Ethernet.HEADER_LEN_MIN ? reader.slice(14) : null;

        resolve({
          core: {
            destination: destination, source: source, ether_type: ether_type
          },
          next: {
            protocol: ether_type,
            payload: payload
          }
        });
      });
    }
  }, {
    key: 'getMACAddress',
    value: function getMACAddress(reader, offset) {
      var chunk = reader.slice(offset, offset + 6),
          bytes = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = chunk.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
    }
  }, {
    key: 'HEADER_LEN_MIN',
    get: function get() {
      return 14;
    }
  }, {
    key: 'ETHER_TYPES',
    get: function get() {
      return new Map([[0x0800, 'IPv4'], [0x86dd, 'IPv6']]);
    }
  }]);

  return Ethernet;
})();

exports.default = Ethernet;