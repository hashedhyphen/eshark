'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PcapngParser = (function () {
  function PcapngParser(buf) {
    _classCallCheck(this, PcapngParser);

    this.buf = buf;
    var magic = this.buf.toString('hex', 8, 12);
    if (magic === '4d3c2b1a') {
      this.endian = 'little';
    } else if (magic === 'a1b2c3d4') {
      this.endian = 'big';
    } else {
      throw { msg: 'unknown endian' };
    }
  }

  _createClass(PcapngParser, [{
    key: 'parse',
    value: function parse() {
      return this.parseBlock();
    }
  }, {
    key: 'parseBlock',
    value: function parseBlock() {
      var arr = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      while (this.buf.length > 0) {
        var block_type = this.buf.readUInt32LE();
        switch (block_type) {
          case 0x0a0d0d0a:
            return this.sectionHeader(arr);
          case 0x00000001:
            return this.interfaceDescription(arr);
          case 0x00000006:
            return this.enhancedPacketBlock(arr);
          default:
          // skip();
        }
        break;
      }
      return arr;
    }
  }, {
    key: 'sectionHeader',
    value: function sectionHeader(arr) {
      var block_len = this.buf.readUInt32LE(4),
          cur_block = this.buf.slice(0, block_len),
          trailer = cur_block.readUInt32LE(cur_block.length - 4);

      if (block_len !== trailer) {
        throw { msg: 'imcompatible block length' };
      }

      var major_ver = cur_block.readUInt16LE(12),
          minor_ver = cur_block.readUInt16LE(14),
          map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Hardware', type: 'utf8' }], [3, { name: 'OS', type: 'utf8' }], [4, { name: 'Application', type: 'utf8' }]]);

      arr.push({
        block_type: 'Section Header',
        version: major_ver + '.' + minor_ver,
        options: this.getOptions(cur_block.slice(24, -4), map)
      });

      this.buf = this.buf.slice(block_len);
      return this.parseBlock(arr);
    }
  }, {
    key: 'interfaceDescription',
    value: function interfaceDescription(arr) {
      var block_len = this.buf.readUInt32LE(4),
          cur_block = this.buf.slice(0, block_len),
          trailer = cur_block.readUInt32LE(block_len - 4);

      if (block_len !== trailer) {
        throw { msg: 'imcompatible block length' };
      }

      var link_type = cur_block.readUInt16LE(8),
          snap_len = cur_block.readUInt32LE(12),
          map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Device', type: 'utf8' }], [9, { name: 'Resolution', type: 'uint8' }], [12, { name: 'OS', type: 'utf8' }]]);

      arr.push({
        block_type: 'Interface Description',
        link_type: link_type,
        options: this.getOptions(cur_block.slice(16, -4), map)
      });

      this.buf = this.buf.slice(block_len);
      return this.parseBlock(arr);
    }
  }, {
    key: 'enhancedPacketBlock',
    value: function enhancedPacketBlock(arr) {
      var block_len = this.buf.readUInt32LE(4),
          cur_block = this.buf.slice(0, block_len),
          trailer = cur_block.readUInt32LE(block_len - 4);

      if (block_len !== trailer) {
        throw { msg: 'imcompatible block length' };
      }

      var interface_id = this.buf.readUInt32LE(8),
          timestamp_high = this.buf.readUInt32LE(12),
          timestamp_low = this.buf.readUInt32LE(16),
          captured_length = this.buf.readUInt32LE(20),
          packet_length = this.buf.readUInt32LE(24),
          packet_data = this.parsePacket(28, captured_length),
          map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Flags', type: 'uint32' }]]);

      arr.push({
        block_type: 'Enhanced Packet',
        interface_id: interface_id,
        timestamp_high: timestamp_high,
        timestamp_low: timestamp_low,
        captured_length: captured_length,
        packet_length: packet_length,
        packet_data: packet_data,
        options: {}
      });

      this.buf = this.buf.slice(block_len);
      return this.parseBlock(arr);
    }
  }, {
    key: 'getOptions',
    value: function getOptions(sub_buf, map) {
      var container = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var code = sub_buf.readUInt16LE(0);

      if (code === 0) {
        if (sub_buf.length === 4) {
          return container;
        } else {
          throw { msg: 'options not terminated' };
        }
      }

      var option_len = sub_buf.readUInt16LE(2),
          padding_len = option_len % 4 === 0 ? 0 : 4 - option_len % 4,
          name = map.get(code) ? map.get(code).name : 'unknown',
          type = map.get(code) ? map.get(code).type : null,
          value = undefined;

      switch (type) {
        case 'uint8':
          value = sub_buf.readUInt8(4);
          break;
        case 'uint32':
          value = sub_buf.readUInt32LE(4);
          break;
        case 'utf8':
          value = sub_buf.toString('utf8', 4, 4 + option_len);
          break;
        case 'hex':
          value = sub_buf.toString('hex', 4, 4 + option_len);
          break;
        default:
          value = sub_buf.toString('utf8', 4, 4 + option_len);
      }
      container[name] = value;

      sub_buf = sub_buf.slice(4 + option_len + padding_len);
      return this.getOptions(sub_buf, map, container);
    }
  }, {
    key: 'parsePacket',
    value: function parsePacket(start, cap_len) {
      var packet = this.buf.slice(start, start + cap_len);
      return packet.toString('hex');
    }
  }]);

  return PcapngParser;
})();

exports['default'] = PcapngParser;
module.exports = exports['default'];