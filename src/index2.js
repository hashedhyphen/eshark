class BufferReader extends Buffer {
  constructor (buf) {
    super(buf);
    this.endian = null;
  }

  setEndian (magic) {
    if (magic === '4d3c2b1a')
      this.endian = 'little';
    else if (magic === '1a2b3c4d')
      this.endian = 'big';
    else
      throw { msg: 'unknown endian' };
  }

  slice (start, end) {
    let sub_reader = new BufferReader(super.slice(start, end));
    sub_reader.endian = this.endian;
    return sub_reader;
  }

  readUInt16 (offset) {
    return this.callMethod('readUInt16', offset);
  }

  readUInt32 (offset) {
    return this.callMethod('readUInt32', offset);
  }

  readInt16 (offset) {
    return this.callMethod('readInt16', offset);
  }

  readInt32 (offset) {
    return this.callMethod('readInt32', offset);
  }

  callMethod (prefix, offset) {
    if (offset && offset < 0)
      offset += this.length;

    if (this.endian === 'little')
      return super[`${prefix}LE`](offset);
    if (this.endian === 'big')
      return super[`${prefix}BE`](offset);
    throw { msg: 'invalid endian' };
  }
}

class PcapngParser {
  static parse (buf) {
    let reader = new BufferReader(buf)
      , parser = new PcapngParser();

    reader.setEndian(reader.toString('hex', 8, 12));
    return parser.parseBlock(reader, []);
  }

  parseBlock (reader, arr) {
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

  sectionHeader (reader, arr) {
    let block_len = reader.readUInt32(4)
      , cur_block = reader.slice(0, block_len);

    if (block_len !== cur_block.readUInt32(-4))
      throw { msg: 'imcompatible block length' };

    let major_ver = cur_block.readUInt16(12)
      , minor_ver = cur_block.readUInt16(14);

    arr.push({
      block_type: 'Section Header',
      version: `${major_ver}.${minor_ver}`,
      options: this.getOptions(cur_block.slice(24, -4), {}, getMap())
    });
    reader = reader.slice(block_len);
    return this.parseBlock(reader, arr);

    function getMap () {
      let table = [
          [1, { name: 'Comment', type: 'utf8' }]
        , [2, { name: 'Hardware' , type: 'utf8' }]
        , [3, { name: 'OS', type: 'utf8' }]
        , [4, { name: 'Application', type: 'utf8'}]
      ];
      return new Map(table);
    }
  }

  interfaceDescription (reader, arr) {
    let block_len = reader.readUInt32(4)
      , cur_block = reader.slice(0, block_len);

    if (block_len !== cur_block.readUInt32(-4))
      throw { msg: 'imcompatible block length' };

    let link_type = cur_block.readUInt16(8)
      , snap_len  = cur_block.readUInt32(12);

    arr.push({
      block_type: 'Interface Description',
      link_type: link_type,
      options: this.getOptions(cur_block.slice(16, -4), getMap())
    });
    reader = reader.slice(block_len);
    return arr;//this.parseBlock(reader, arr);

    function getMap () {
      let table = [
        [1,  { name: 'Comment', type: 'utf8' }],
        [2,  { name: 'Device' , type: 'utf8' }],
        [9,  { name: 'Resolution', type: 'uint8'}],
        [12, { name: 'OS', type: 'utf8'}]
      ];
      return new Map(table);
    }
  }

  getOptions (reader, container, map) {
    let code = reader.readUInt16(0);

    if (code === 0) {
      if (reader.length === 4)
        return container;
      throw { msg: 'options not terminated' };
    }

    let option_len = reader.readUInt16(2)
      , padding_len = option_len%4 === 0 ? 0 : 4 - option_len%4
      , name = map.get(code) ? map.get(code).name : 'unknown'
      , type = map.get(code) ? map.get(code).type : null
      , value;

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
}

require('fs').readFile(process.argv[2], (err, buf) => {
  if (err)
    return console.error(`Error: ${err}`);

  if (buf.toString('hex', 0, 4) === '0a0d0d0a') {
    return console.log(
      JSON.stringify(PcapngParser.parse(buf), null, '  ')
    );
  }
  //else
    //return parsePcap([], buf);
});
