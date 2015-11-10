'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

var _ethernet = require('../protocol/ethernet.js');

var _ethernet2 = _interopRequireDefault(_ethernet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

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
          var ethernet;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return new _ethernet2.default(reader).parse();

              case 2:
                ethernet = _context.sent;

                resolve(ethernet);

              case 4:
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
;