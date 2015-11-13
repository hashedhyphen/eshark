'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Unable to extend Buffer...

var BufferReader = (function () {
  function BufferReader(buf, format, endian) {
    _classCallCheck(this, BufferReader);

    this.buf = buf;
    this.format = format;
    this.endian = endian || getEndian(buf, format);
  }

  _createClass(BufferReader, [{
    key: 'toString',
    value: function toString() /*args*/{
      return Buffer.prototype.toString.apply(this.buf, arguments);
    }
  }, {
    key: 'slice',
    value: function slice(start, end) {
      return new BufferReader(this.buf.slice(start, end), this.format, this.endian);
    }
  }, {
    key: 'readUInt8',
    value: function readUInt8(offset) {
      return callMethod(this.buf, 'readUInt8', offset);
    }
  }, {
    key: 'readUInt16BE',
    value: function readUInt16BE(offset) {
      return callMethod(this.buf, 'readUInt16BE', offset);
    }
  }, {
    key: 'readUInt16LE',
    value: function readUInt16LE(offset) {
      return callMethod(this.buf, 'readUInt16LE', offset);
    }
  }, {
    key: 'readUInt32BE',
    value: function readUInt32BE(offset) {
      return callMethod(this.buf, 'readUInt32BE', offset);
    }
  }, {
    key: 'readUInt32LE',
    value: function readUInt32LE(offset) {
      return callMethod(this.buf, 'readUInt32LE', offset);
    }
  }, {
    key: 'readInt8',
    value: function readInt8(offset) {
      return callMethod(this.buf, 'readInt8', offset);
    }
  }, {
    key: 'readInt16BE',
    value: function readInt16BE(offset) {
      return callMethod(this.buf, 'readInt16BE', offset);
    }
  }, {
    key: 'readInt16LE',
    value: function readInt16LE(offset) {
      return callMethod(this.buf, 'readInt16LE', offset);
    }
  }, {
    key: 'readInt32BE',
    value: function readInt32BE(offset) {
      return callMethod(this.buf, 'readInt32BE', offset);
    }
  }, {
    key: 'readInt32LE',
    value: function readInt32LE(offset) {
      return callMethod(this.buf, 'readInt32LE', offset);
    }
  }, {
    key: 'values',
    value: function values() {
      return this.buf.values();
    }
  }, {
    key: 'keys',
    value: function keys() {
      return this.buf.keys();
    }
  }, {
    key: 'entries',
    value: function entries() {
      return this.buf.entries();
    }
  }, {
    key: 'length',
    get: function get() {
      return this.buf.length;
    }
  }]);

  return BufferReader;
})();

// Helpers

exports.default = BufferReader;
function getEndian(buf, format) {
  var magic = '';
  if (format === 'pcapng') {
    magic = buf.toString('hex', 8, 12);
  } else if (format === 'pcap') {
    magic = buf.toString('hex', 0, 4);
  }

  if (magic === '4d3c2b1a') {
    return 'little';
  } else if (magic === '1a2b3c4d') {
    return 'big';
  } else {
    throw new Error('unknown endian');
  }
}

function callMethod(buf, prefix, offset) {
  if (offset && offset < 0) {
    offset += this.length;
  }
  return buf[prefix](offset);
}