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

  //return parser.parseBlock(reader, []);

  _createClass(PcapngParser, [{
    key: 'parseBlock',
    value: function parseBlock(reader, arr) {
      while (reader.length > 0) {
        switch (reader.readUInt32()) {
          case 0x0a0d0d0a:
            return this.sectionHeader(reader, arr);
          case 0x00000001:
            return this.interfaceDescription(reader, arr);
          default:
          // skip();
        }
      }
      return arr;
    }
  }, {
    key: 'sectionHeader',
    value: function sectionHeader(reader, arr) {
      var block_len = reader.readUInt32(4),
          cur_block = reader.slice(0, block_len);

      if (block_len !== cur_block.readUInt32(-4)) throw { msg: 'imcompatible block length' };

      var major_ver = cur_block.readUInt16(12),
          minor_ver = cur_block.readUInt16(14);

      arr.push({
        block_type: 'Section Header',
        version: major_ver + '.' + minor_ver,
        options: this.getOptions(cur_block.slice(24, -4), {}, getMap())
      });
      reader = reader.slice(block_len);
      return this.parseBlock(reader, arr);

      function getMap() {
        var table = [[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Hardware', type: 'utf8' }], [3, { name: 'OS', type: 'utf8' }], [4, { name: 'Application', type: 'utf8' }]];
        return new Map(table);
      }
    }
  }, {
    key: 'interfaceDescription',
    value: function interfaceDescription(reader, arr) {
      var block_len = reader.readUInt32(4),
          cur_block = reader.slice(0, block_len);

      if (block_len !== cur_block.readUInt32(-4)) throw { msg: 'imcompatible block length' };

      var link_type = cur_block.readUInt16(8),
          snap_len = cur_block.readUInt32(12);

      arr.push({
        block_type: 'Interface Description',
        link_type: link_type,
        options: this.getOptions(cur_block.slice(16, -4), getMap())
      });
      reader = reader.slice(block_len);
      return arr; //this.parseBlock(reader, arr);

      function getMap() {
        var table = [[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Device', type: 'utf8' }], [9, { name: 'Resolution', type: 'uint8' }], [12, { name: 'OS', type: 'utf8' }]];
        return new Map(table);
      }
    }
  }, {
    key: 'getOptions',
    value: function getOptions(reader, container, map) {
      var code = reader.readUInt16(0);

      if (code === 0) {
        if (reader.length === 4) return container;
        throw { msg: 'options not terminated' };
      }

      var option_len = reader.readUInt16(2),
          padding_len = option_len % 4 === 0 ? 0 : 4 - option_len % 4,
          name = map.get(code) ? map.get(code).name : 'unknown',
          type = map.get(code) ? map.get(code).type : null,
          value = undefined;

      if (type === 'utf8') {
        value = reader.toString('utf8', 4, 4 + option_len);
      } else if (type === 'hex') {
        value = reader.toString('hex', 4, 4 + option_len);
      } else if (type === 'uint8') {
        value = reader.readUInt8(4);
      } else {
        value = reader.toString('utf8', 4, 4 + option_len);
      }

      container[name] = value;
      reader = reader.slice(4 + option_len + padding_len);
      return this.getOptions(reader, container, map);
    }
  }]);

  return PcapngParser;
})();

exports['default'] = PcapngParser;
module.exports = exports['default'];