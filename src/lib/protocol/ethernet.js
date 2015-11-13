export default class Ethernet {
  static get HEADER_LEN_MIN() {
    return 14;
  }

  static get ETHER_TYPES() {
    return new Map([
      [0x0800, 'IPv4'],
      [0x86dd, 'IPv6']
    ]);
  }

  static parse(reader) {
    return new Promise((resolve, reject) => {
      if (reader.length < Ethernet.HEADER_LEN_MIN) {
        reject(Error('too short length for Ethernet'));
      }

      let destination = Ethernet.getMACAddress(reader, 0)
        , source      = Ethernet.getMACAddress(reader, 6)
        , ether_type  = Ethernet.ETHER_TYPES.get(reader.readUInt16BE(12))
        , payload     = (reader.length > Ethernet.HEADER_LEN_MIN)
                        ? reader.slice(14) : null
        ;

      resolve({
        core: {
          destination, source, ether_type
        },
        next: {
          protocol: ether_type,
          payload:  payload
        }
      });
    });
  }

  static getMACAddress(reader, offset) {
    let chunk = reader.slice(offset, offset + 6)
      , bytes = [];

    for (let b of chunk.values()) {
      let hex = b.toString(16);
      bytes.push((b < 0x10) ? `0${hex}` : hex);
    }

    return bytes.join(':');
  }
}
