'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var BufferReader = (function () {
  function BufferReader(buf, type, endian) {
    _classCallCheck(this, BufferReader);

    this.buf = buf;
    this.type = type;
    this.length = this.buf.length;
    if (endian) {
      this.endian = endian;return this;
    }

    var magic = '';
    if (type === 'pcapng') {
      magic = buf.toString('hex', 8, 12);
    } else if (type === 'pcap') {
      magic = buf.toString('hex', 0, 4);
    }

    if (magic === '4d3c2b1a') {
      this.endian = 'little';
    } else if (magic === '1a2b3c4d') {
      this.endian = 'big';
    } else {
      throw new Error('unknown endian');
    }
  }

  _createClass(BufferReader, [{
    key: 'toString',
    value: function toString(args) {
      return this.buf.toString.apply(this.buf, arguments);
    }
  }, {
    key: 'slice',
    value: function slice(start, end) {
      return new BufferReader(this.buf.slice(start, end), this.type, this.endian);
    }
  }, {
    key: 'next',
    value: function next(skip_len) {
      this.buf = this.buf.slice(skip_len);
      this.length = this.buf.length;
    }
  }, {
    key: 'readUInt8',
    value: function readUInt8(offset) {
      return this.buf.readUInt8(offset);
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
    key: 'readInt8',
    value: function readInt8(offset) {
      return this.buf.readInt8(offset);
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
      if (offset && offset < 0) {
        offset += this.length;
      }
      if (this.endian === 'little') {
        return this.buf[prefix + 'LE'](offset);
      }
      if (this.endian === 'big') {
        return this.buf[prefix + 'BE'](offset);
      }
      throw new Error('invalid endian');
    }
  }]);

  return BufferReader;
})();

exports['default'] = BufferReader;
module.exports = exports['default'];