// Helper module for Options
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionopt

export default (reader, map) => {
  return function extractOptions (container = {}) {
    let code = reader.readUInt16(0);

    if (code === 0) {
      if (reader.length === 4) { return container;  }
      else { throw new Error('options not terminated'); }
    }

    let option_len  = reader.readUInt16(2)
      , padding_len = option_len%4 === 0 ? 0 : 4 - option_len%4
      , name = map.get(code) ? map.get(code).name : 'unknown'
      , type = map.get(code) ? map.get(code).type : null
      , value;

    switch (type) {
      case 'uint8':
        value = reader.readUInt8(4);
        break;
      case 'uint32':
        value = reader.readUInt32(4);
        break;
      case 'utf8':
        value = reader.toString('utf8', 4, 4 + option_len);
        break;
      case 'hex':
        value = reader.toString('hex' , 4, 4 + option_len);
        break;
      default:
        value = reader.toString('utf8', 4, 4 + option_len);
    }
    container[name] = value;

    reader.next(4 + option_len + padding_len);
    return extractOptions(container);
  }();
};
