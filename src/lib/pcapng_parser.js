export default class PcapngParser {
  constructor (buf) {
    this.buf = buf;
    let magic = this.buf.toString('hex', 8, 12);
         if (magic === '4d3c2b1a') { this.endian = 'little'; }
    else if (magic === 'a1b2c3d4') { this.endian = 'big';    }
    else { throw { msg: 'unknown endian' }; }
  }

  parse () {
    return this.parseBlock();
  }

  parseBlock (arr = []) {
    while (this.buf.length > 0) {
      let block_type = this.buf.readUInt32LE();
      switch (block_type) {
        case 0x0a0d0d0a:
          return this.sectionHeader(arr);
        case 0x00000001:
          return this.interfaceDescription(arr);
        default:
          // skip();
      }
    }
    return arr;
  }

  sectionHeader (arr) {
    let block_len = this.buf.readUInt32LE(4)
      , cur_block = this.buf.slice(0, block_len)
      , trailer   = cur_block.readUInt32LE(cur_block.length - 4);

    if (block_len !== trailer) {
      throw { msg: 'imcompatible block length' };
    }

    let major_ver = cur_block.readUInt16LE(12)
      , minor_ver = cur_block.readUInt16LE(14)
      , map = new Map([
          [1, { name: 'Comment', type: 'utf8' }],
          [2, { name: 'Hardware' , type: 'utf8' }],
          [3, { name: 'OS', type: 'utf8' }],
          [4, { name: 'Application', type: 'utf8'}]
        ]);

    arr.push({
      block_type: 'Section Header',
      version: `${major_ver}.${minor_ver}`,
      options: this.getOptions(cur_block.slice(24, -4), map)
    });

    this.buf = this.buf.slice(block_len);
    return this.parseBlock(arr);
  }

  interfaceDescription (arr) {
    let block_len = this.buf.readUInt32LE(4)
      , cur_block = this.buf.slice(0, block_len)
      , trailer   = cur_block.readUInt32LE(block_len - 4);

    if (block_len !== trailer) {
      throw { msg: 'imcompatible block length' };
    }

    let link_type = cur_block.readUInt16LE(8)
      , snap_len  = cur_block.readUInt32LE(12)
      , map = new Map([
          [1,  { name: 'Comment', type: 'utf8' }],
          [2,  { name: 'Device' , type: 'utf8' }],
          [9,  { name: 'Resolution', type: 'uint8'}],
          [12, { name: 'OS', type: 'utf8'}]
        ]);

    arr.push({
      block_type: 'Interface Description',
      link_type: link_type,
      options: this.getOptions(cur_block.slice(16, -4), map)
    });

    this.buf = this.buf.slice(block_len);
    return arr;//this.parseBlock(reader, arr);
  }

  getOptions (sub_buf, map, container = {}) {
    let code = sub_buf.readUInt16LE(0);

    if (code === 0) {
      if (sub_buf.length === 4) { return container;  }
      else { throw { msg: 'options not terminated' }; }
    }

    let option_len = sub_buf.readUInt16LE(2)
      , padding_len = option_len%4 === 0 ? 0 : 4 - option_len%4
      , name = map.get(code) ? map.get(code).name : 'unknown'
      , type = map.get(code) ? map.get(code).type : null
      , value;

    switch (type) {
      case 'uint8':
        value = sub_buf.readUInt8(4);
        break;
      case 'utf8':
        value = sub_buf.toString('utf8', 4, 4 + option_len);
        break;
      case 'hex':
        value = sub_buf.toString('hex' , 4, 4 + option_len);
        break;
      default:
        value = sub_buf.toString('utf8', 4, 4 + option_len);
    }
    container[name] = value;

    sub_buf = sub_buf.slice(4 + option_len + padding_len);
    return this.getOptions(sub_buf, map, container);
  }
}
