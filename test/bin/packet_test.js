'use strict';

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _buffer_reader = require('../../bin/lib/shared/buffer_reader.js');

var _buffer_reader2 = _interopRequireDefault(_buffer_reader);

var _icmp = require('../../bin/lib/protocol/icmp.js');

var _icmp2 = _interopRequireDefault(_icmp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var file_path = 'test/icmp_reply.bin';

_fs2.default.readFile(file_path, (function () {
  var _this = this;

  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(err, buf) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _icmp2.default)(new _buffer_reader2.default(buf, 'pcapng', 'little'));

        case 2:
          result = _context.sent;

          console.log(result);

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