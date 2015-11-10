export default class Ethernet {
  constructor(reader) {
    this.reader = reader;
  }

  static get HEADER_LEN_MIN() {
    return 14;
  }

  static get ETHER_TYPES() {
    return new Map([
      [0x0800, 'Internet Protocol Version 4'],
      [0x86dd, 'Internet Protocol Version 6']
    ]);
  }

  parse() {
    return new Promise((resolve, reject) => {
      if (this.reader.length < Ethernet.HEADER_LEN_MIN) {
        reject(Error('too short length for Ethernet'));
      }

      let destination = this.getMACAddress(this.reader, 0)
        , source      = this.getMACAddress(this.reader, 6)
        , ether_type  = Ethernet.ETHER_TYPES.get(this.reader.buf.readUInt16BE(12))
        , payload     = this.reader.length > Ethernet.HEADER_LEN_MIN ? this.reader.slice(14)
                                                        : null;
      resolve({ destination, source, ether_type, payload });
    });
  }

  getMACAddress(start) {
    let chunk = this.reader.buf.slice(start, start + 6)
      , bytes = [];

    for (let b of chunk) {
      let hex = b.toString(16);
      bytes.push(b < 0x10 ? `0${hex}` : hex);
    }

    return bytes.join(':');
  }
}
