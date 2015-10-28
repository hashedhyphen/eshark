export default class BufferReader {
  constructor (buf, type, endian) {
    this.buf    = buf;
    this.type   = type;
    this.length = this.buf.length;
    if (endian) { this.endian = endian; return this; }

    let magic = '';
         if (type === 'pcapng') { magic = buf.toString('hex', 8, 12); }
    else if (type === 'pcap')   { magic = buf.toString('hex', 0,  4); }

         if (magic === '4d3c2b1a') { this.endian = 'little'; }
    else if (magic === '1a2b3c4d') { this.endian = 'big';    }
    else { throw new Error('unknown endian'); }
  }

  toString (args) {
    return this.buf.toString.apply(this.buf, arguments);
  }

  slice (start, end) {
    return new BufferReader(
      this.buf.slice(start, end), this.type, this.endian
    );
  }

  next (skip_len) {
    this.buf    = this.buf.slice(skip_len);
    this.length = this.buf.length;
  }

  readUInt8 (offset) {
    return this.buf.readUInt8(offset);
  }

  readUInt16 (offset) {
    return this.callMethod('readUInt16', offset);
  }

  readUInt32 (offset) {
    return this.callMethod('readUInt32', offset);
  }

  readInt8 (offset) {
    return this.buf.readInt8(offset);
  }

  readInt16 (offset) {
    return this.callMethod('readInt16', offset);
  }

  readInt32 (offset) {
    return this.callMethod('readInt32', offset);
  }

  callMethod (prefix, offset) {
    if (offset && offset < 0) { offset += this.length; }
    if (this.endian === 'little') { return this.buf[`${prefix}LE`](offset); }
    if (this.endian === 'big')    { return this.buf[`${prefix}BE`](offset); }
    throw new Error('invalid endian');
  }
}
