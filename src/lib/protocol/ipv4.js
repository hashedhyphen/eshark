export default class IPv4 {
  static get HEADER_LEN_MIN() {
    return 20;
  }

  static get PROTOCOLS() {
    return new Map([
      [1,  'ICMP'],
      [6,  'TCP' ],
      [17, 'UDP' ]
    ]);
  }

  static parse(reader) {
    return new Promise((resolve, reject) => {
      if (reader.length < IPv4.HEADER_LEN_MIN) {
        reject(new Error('too short length for IPv4'));
      }

      let version     = reader.readUInt8(0) >>> 4
        , ihl         = (reader.readUInt8() & 0xf) * 4  // in bytes
        , service     = `0x${reader.toString('hex', 1, 2)}`
        , total_len   = reader.readUInt16BE(3)
        , id          = `0x${reader.toString('hex', 4, 6)}`
        , flags       = reader.readUInt8(6) >>> 5
        , offset      = (reader.readUInt8(6)&0x1)*0x100 + reader.readUInt8(7)
        , ttl         = reader.readUInt8(8)
        , protocol    = IPv4.PROTOCOLS.get(reader.readUInt8(9))
        , checksum    = `0x${reader.toString('hex', 10, 12)}`
        , source      = IPv4.getIPv4Address(reader, 12)
        , destination = IPv4.getIPv4Address(reader, 16)
        , payload     = (reader.length > IPv4.HEADER_LEN_MIN)
                        ? reader.slice(ihl) : null
        ;

      resolve({
        core: {
          version, ihl, service, total_len, id, flags, offset,
          ttl, protocol, checksum, source, destination
        },
        next: {
          protocol: protocol,
          payload:  payload
        }
      });
    });
  }

  static getIPv4Address(reader, offset) {
    let chunk = reader.buf.slice(offset, offset + 4)
      , bytes = [];

    for (let b of chunk.values()) { bytes.push(b); }
    return bytes.join('.');
  }
}
