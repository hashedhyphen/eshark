'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _ethernet = require('../protocol/ethernet.js');

var _ethernet2 = _interopRequireDefault(_ethernet);

var _ipv = require('../protocol/ipv4.js');

var _ipv2 = _interopRequireDefault(_ipv);

var _icmp = require('../protocol/icmp.js');

var _icmp2 = _interopRequireDefault(_icmp);

var _tcp = require('../protocol/tcp.js');

var _tcp2 = _interopRequireDefault(_tcp);

var _udp = require('../protocol/udp.js');

var _udp2 = _interopRequireDefault(_udp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var PARSERS = new Map([['Ethernet', _ethernet2.default], ['IPv4', _ipv2.default], ['ICMP', _icmp2.default], ['TCP', _tcp2.default], ['UDP', _udp2.default]]);

var PacketParser = (function () {
  function PacketParser() {
    _classCallCheck(this, PacketParser);
  }

  _createClass(PacketParser, null, [{
    key: 'parse',
    value: function parse(reader) {
      return new Promise((function () {
        var _this = this;

        var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve, reject) {
          var protocol, payload, results, result;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                protocol = 'Ethernet', payload = reader, results = [];

              case 1:
                if (!true) {
                  _context.next = 14;
                  break;
                }

                _context.next = 4;
                return PARSERS.get(protocol).parse(payload);

              case 4:
                result = _context.sent;

                results.push({
                  type: protocol,
                  spec: result.core
                });

                if (!PARSERS.get(result.next.protocol)) {
                  _context.next = 10;
                  break;
                }

                protocol = result.next.protocol;
                payload = result.next.payload;
                return _context.abrupt('continue', 1);

              case 10:

                results.push({
                  type: result.next.protocol || 'data',
                  spec: result.next.payload.toString('hex')
                });
                return _context.abrupt('break', 14);

              case 14:

                resolve(results);

              case 15:
              case 'end':
                return _context.stop();
            }
          }, _callee, _this);
        }));

        return function (_x, _x2) {
          return ref.apply(this, arguments);
        };
      })());
    }
  }]);

  return PacketParser;
})();

exports.default = PacketParser;