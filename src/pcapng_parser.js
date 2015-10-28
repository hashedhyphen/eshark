import BufferReader from './lib/share/buffer_reader.js';

export default class PcapngParser {
  constructor (buf) {
    this.reader = new BufferReader(buf, 'pcapng');
  }

  parse () {
    return this.parseBlock();
  }

  parseBlock (arr = []) {
    while (this.reader.length > 0) {
      let block_type = this.reader.readUInt32();
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

  sectionHeader (arr) {
    let block_len = this.reader.readUInt32(4)
      , cur_block = this.reader.slice(0, block_len)
      , trailer   = cur_block.readUInt32(-4);

    if (block_len !== trailer) {
      throw new Error('imcompatible block length');
    }

    let major_ver = cur_block.readUInt16(12)
      , minor_ver = cur_block.readUInt16(14)
      , map = new Map([
          [1, { name: 'Comment',     type: 'utf8' }],
          [2, { name: 'Hardware' ,   type: 'utf8' }],
          [3, { name: 'OS',          type: 'utf8' }],
          [4, { name: 'Application', type: 'utf8' }]
        ]);

    arr.push({
      block_type: 'Section Header',
      version:    `${major_ver}.${minor_ver}`,
      options:    this.getOptions(cur_block.slice(24, -4), map)
    });

    this.reader.next(block_len);
    return this.parseBlock(arr);
  }

  interfaceDescription (arr) {
    let block_len = this.reader.readUInt32(4)
      , cur_block = this.reader.slice(0, block_len)
      , trailer   = cur_block.readUInt32(block_len - 4);

    if (block_len !== trailer) {
      throw { msg: 'imcompatible block length' };
    }

    let link_type = cur_block.readUInt16(8)
      , snap_len  = cur_block.readUInt32(12)
      , map = new Map([
          [1,  { name: 'Comment',    type: 'utf8' }],
          [2,  { name: 'Device' ,    type: 'utf8' }],
          [9,  { name: 'Resolution', type: 'uint8'}],
          [12, { name: 'OS',         type: 'utf8' }]
        ]);

    arr.push({
      block_type: 'Interface Description',
      link_type:  link_type,
      options:    this.getOptions(cur_block.slice(16, -4), map)
    });

    this.reader.next(block_len);
    return this.parseBlock(arr);
  }

  enhancedPacketBlock (arr) {
    let block_len = this.reader.readUInt32(4)
      , cur_block = this.reader.slice(0, block_len)
      , trailer   = cur_block.readUInt32(block_len - 4);

    if (block_len !== trailer) {
      throw { msg: 'imcompatible block length' };
    }

    let interface_id    = this.reader.readUInt32(8)
      , timestamp_high  = this.reader.readUInt32(12)
      , timestamp_low   = this.reader.readUInt32(16)
      , captured_length = this.reader.readUInt32(20)
      , packet_length   = this.reader.readUInt32(24)
      , packet_data     = this.parsePacket(28, captured_length)
      , map = new Map([
          [1, { name: 'Comment', type: 'utf8'   }],
          [2, { name: 'Flags'  , type: 'uint32' }]
        ]);

    arr.push({
      block_type: 'Enhanced Packet',
      interface_id,
      timestamp_high,
      timestamp_low,
      captured_length,
      packet_length,
      packet_data,
      options: {}
    });

    this.reader.next(block_len);
    return this.parseBlock(arr);
  }

  getOptions (sub_reader, map, container = {}) {
    let code = sub_reader.readUInt16(0);

    if (code === 0) {
      if (sub_reader.length === 4) { return container;  }
      else { throw new Error('options not terminated'); }
    }

    let option_len  = sub_reader.readUInt16(2)
      , padding_len = option_len%4 === 0 ? 0 : 4 - option_len%4
      , name = map.get(code) ? map.get(code).name : 'unknown'
      , type = map.get(code) ? map.get(code).type : null
      , value;

    switch (type) {
      case 'uint8':
        value = sub_reader.readUInt8(4);
        break;
      case 'uint32':
        value = sub_reader.readUInt32(4);
        break;
      case 'utf8':
        value = sub_reader.toString('utf8', 4, 4 + option_len);
        break;
      case 'hex':
        value = sub_reader.toString('hex' , 4, 4 + option_len);
        break;
      default:
        value = sub_reader.toString('utf8', 4, 4 + option_len);
    }
    container[name] = value;

    sub_reader.next(4 + option_len + padding_len);
    return this.getOptions(sub_reader, map, container);
  }

  parsePacket (start, cap_len) {
    let packet = this.reader.slice(start, start + cap_len);
    return packet.toString('hex');
  }
}
