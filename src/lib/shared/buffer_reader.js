// Unable to extend Buffer...
export default class BufferReader {
  constructor(buf, format, endian) {
    this.buf = buf;
    this.format = format;
    this.endian = endian || getEndian(buf, format);
  }

  get length() {
    return this.buf.length;
  }

  toString(args) {
    return Buffer.prototype.toString.apply(this.buf, arguments);
  }

  slice(start, end) {
    return new BufferReader(
      this.buf.slice(start, end), this.format, this.endian
    );
  }

  readUInt8(offset) {
    return callMethod(this.buf, 'readUInt8', offset);
  }

  readUInt16BE(offset) {
    return callMethod(this.buf, 'readUInt16BE', offset);
  }

  readUInt16LE(offset) {
    return callMethod(this.buf, 'readUInt16LE', offset);
  }

  readUInt32BE(offset) {
    return callMethod(this.buf, 'readUInt32BE', offset);
  }

  readUInt32LE(offset) {
    return callMethod(this.buf, 'readUInt32LE', offset);
  }

  readInt8(offset) {
    return callMethod(this.buf, 'readInt8', offset);
  }

  readInt16BE(offset) {
    return callMethod(this.buf, 'readInt16BE', offset);
  }

  readInt16LE(offset) {
    return callMethod(this.buf, 'readInt16LE', offset);
  }

  readInt32BE(offset) {
    return callMethod(this.buf, 'readInt32BE', offset);
  }

  readInt32LE(offset) {
    return callMethod(this.buf, 'readInt32LE', offset);
  }

  values() {
    return this.buf.values();
  }

  keys() {
    return this.buf.keys();
  }

  entries() {
    return this.buf.entries();
  }
}


// Helpers

function getEndian(buf, format) {
  let magic = '';
       if (format === 'pcapng') { magic = buf.toString('hex', 8, 12); }
  else if (format === 'pcap'  ) { magic = buf.toString('hex', 0,  4); }

       if (magic === '4d3c2b1a') { return 'little'; }
  else if (magic === '1a2b3c4d') { return 'big';    }
  else { throw new Error('unknown endian'); }
}

function callMethod(buf, prefix, offset) {
  if (offset && offset < 0) { offset += this.length; }
  return buf[prefix](offset);
}
