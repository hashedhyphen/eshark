'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buffer_reader = require('./lib/shared/buffer_reader.js');

var _buffer_reader2 = _interopRequireDefault(_buffer_reader);

var _section_header = require('./lib/pcapng/section_header.js');

var _section_header2 = _interopRequireDefault(_section_header);

var _interface_description = require('./lib/pcapng/interface_description.js');

var _interface_description2 = _interopRequireDefault(_interface_description);

var _enhanced_packet = require('./lib/pcapng/enhanced_packet.js');

var _enhanced_packet2 = _interopRequireDefault(_enhanced_packet);

var _interface_statistics = require('./lib/pcapng/interface_statistics.js');

var _interface_statistics2 = _interopRequireDefault(_interface_statistics);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PcapngParser = (function () {
  function PcapngParser(buf) {
    _classCallCheck(this, PcapngParser);

    this.reader = new _buffer_reader2.default(buf, 'pcapng');
  }

  _createClass(PcapngParser, [{
    key: 'parse',
    value: function parse() {
      var blocks = [];
      while (this.reader.length > 0) {
        var block_type = this.reader.readUInt32();
        switch (block_type) {
          case 0x0a0d0d0a:
            blocks.push((0, _section_header2.default)(this.reader));
            break;
          case 0x00000001:
            blocks.push((0, _interface_description2.default)(this.reader));
            break;
          case 0x00000006:
            blocks.push((0, _enhanced_packet2.default)(this.reader));
            break;
          case 0x00000005:
            blocks.push((0, _interface_statistics2.default)(this.reader));
            break;
          default:
            console.log('unknown block_type ' + block_type);
            return blocks; // skip();
        }
      }
      return blocks;
    }
  }]);

  return PcapngParser;
})();

exports.default = PcapngParser;