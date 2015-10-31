'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _libSharedBuffer_readerJs = require('./lib/shared/buffer_reader.js');

var _libSharedBuffer_readerJs2 = _interopRequireDefault(_libSharedBuffer_readerJs);

var _libPcapngSection_headerJs = require('./lib/pcapng/section_header.js');

var _libPcapngSection_headerJs2 = _interopRequireDefault(_libPcapngSection_headerJs);

var _libPcapngInterface_descriptionJs = require('./lib/pcapng/interface_description.js');

var _libPcapngInterface_descriptionJs2 = _interopRequireDefault(_libPcapngInterface_descriptionJs);

var _libPcapngEnhanced_packetJs = require('./lib/pcapng/enhanced_packet.js');

var _libPcapngEnhanced_packetJs2 = _interopRequireDefault(_libPcapngEnhanced_packetJs);

var _libPcapngInterface_statisticsJs = require('./lib/pcapng/interface_statistics.js');

var _libPcapngInterface_statisticsJs2 = _interopRequireDefault(_libPcapngInterface_statisticsJs);

var PcapngParser = (function () {
  function PcapngParser(buf) {
    _classCallCheck(this, PcapngParser);

    this.reader = new _libSharedBuffer_readerJs2['default'](buf, 'pcapng');
  }

  _createClass(PcapngParser, [{
    key: 'parse',
    value: function parse() {
      var blocks = [];
      while (this.reader.length > 0) {
        var block_type = this.reader.readUInt32();
        switch (block_type) {
          case 0x0a0d0d0a:
            blocks.push((0, _libPcapngSection_headerJs2['default'])(this.reader));
            break;
          case 0x00000001:
            blocks.push((0, _libPcapngInterface_descriptionJs2['default'])(this.reader));
            break;
          case 0x00000006:
            blocks.push((0, _libPcapngEnhanced_packetJs2['default'])(this.reader));
            break;
          case 0x00000005:
            blocks.push((0, _libPcapngInterface_statisticsJs2['default'])(this.reader));
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

exports['default'] = PcapngParser;
module.exports = exports['default'];