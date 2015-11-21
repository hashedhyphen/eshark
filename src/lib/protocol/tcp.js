export default class TCP {
  static get HEADER_LEN_MIN() {
    return 20;
  }

  static get WELL_KNOWN_PORTS() {
    return new Map([
      [ 80, 'HTTP' ],
      [443, 'HTTPS']
    ]);
  }

  static parse(reader) {
    return new Promise((resolve, reject) => {
      if (reader.length < TCP.HEADER_LEN_MIN) {
        reject(new Error('too short length for TCP'));
      }

      let source      = reader.readUInt16BE(0)
        , destination = reader.readUInt16BE(2)
        , seq_num     = reader.readUInt32BE(4)
        , ack_num     = reader.readUInt32BE(8)
        , header_len  = (reader.readUInt8(12) >>> 4) * 4
        , flags       = TCP.getTCPFlags(reader.readUInt8(13) & 0x3f)
        , window_size = reader.readUInt16BE(14)
        , checksum    = `0x${reader.toString('hex', 16, 18)}`
        , urgent_ptr  = reader.readUInt16BE(18)
        , options     = /*(header_len == HEADER_LEN_MIN) ?*/ null
        , payload     = (reader.length > TCP.HEADER_LEN_MIN) ?
                        reader.slice(header_len) : null
        ;

      resolve({
        core: {
          source, destination, seq_num, ack_num, header_len, flags,
          window_size, checksum, urgent_ptr, options
        },
        next: {
          protocol: TCP.lookUpProtocol([source, destination]),
          payload:  payload
        }
      });
    });
  }

  static getTCPFlags(bits) {
    return {
      urg: +!!(bits & 0x20), ack: +!!(bits & 0x10),
      psh: +!!(bits & 0x08), rst: +!!(bits & 0x04),
      syn: +!!(bits & 0x02), fin: +!!(bits & 0x01)
    };
  }

  static lookUpProtocol(ports) {
    return TCP.WELL_KNOWN_PORTS.get(ports[0])
        || TCP.WELL_KNOWN_PORTS.get(ports[1])
        || null;
  }
}
