'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BufferReader = (function (_Buffer) {
  _inherits(BufferReader, _Buffer);

  function BufferReader(buf) {
    _classCallCheck(this, BufferReader);

    _get(Object.getPrototypeOf(BufferReader.prototype), 'constructor', this).call(this, buf);
    this.endian = null;
  }

  _createClass(BufferReader, [{
    key: 'setEndian',
    value: function setEndian(magic) {
      if (magic === '4d3c2b1a') this.endian = 'little';else if (magic === '1a2b3c4d') this.endian = 'big';else throw { msg: 'unknown endian' };
    }
  }, {
    key: 'slice',
    value: function slice(start, end) {
      var sub_reader = new BufferReader(_get(Object.getPrototypeOf(BufferReader.prototype), 'slice', this).call(this, start, end));
      sub_reader.endian = this.endian;
      return sub_reader;
    }
  }, {
    key: 'readUInt16',
    value: function readUInt16(offset) {
      return this.callMethod('readUInt16', offset);
    }
  }, {
    key: 'readUInt32',
    value: function readUInt32(offset) {
      return this.callMethod('readUInt32', offset);
    }
  }, {
    key: 'readInt16',
    value: function readInt16(offset) {
      return this.callMethod('readInt16', offset);
    }
  }, {
    key: 'readInt32',
    value: function readInt32(offset) {
      return this.callMethod('readInt32', offset);
    }
  }, {
    key: 'callMethod',
    value: function callMethod(prefix, offset) {
      if (offset && offset < 0) offset += this.length;

      if (this.endian === 'little') return _get(Object.getPrototypeOf(BufferReader.prototype), prefix + 'LE', this).call(this, offset);
      if (this.endian === 'big') return _get(Object.getPrototypeOf(BufferReader.prototype), prefix + 'BE', this).call(this, offset);
      throw { msg: 'invalid endian' };
    }
  }]);

  return BufferReader;
})(Buffer);

var PcapngParser = (function () {
  function PcapngParser() {
    _classCallCheck(this, PcapngParser);
  }

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
  }], [{
    key: 'parse',
    value: function parse(buf) {
      var reader = new BufferReader(buf),
          parser = new PcapngParser();

      reader.setEndian(reader.toString('hex', 8, 12));
      return parser.parseBlock(reader, []);
    }
  }]);

  return PcapngParser;
})();

require('fs').readFile(process.argv[2], function (err, buf) {
  if (err) return console.error('Error: ' + err);

  if (buf.toString('hex', 0, 4) === '0a0d0d0a') {
    return console.log(JSON.stringify(PcapngParser.parse(buf), null, '  '));
  }
  //else
  //return parsePcap([], buf);
});