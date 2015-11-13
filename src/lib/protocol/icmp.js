export default class ICMP {
  static get HEADER_LEN_MIN() {
    return 8;
  }

  static parse(reader) {
    return new Promise((resolve, reject) => {
      if (reader.length < ICMP.HEADER_LEN_MIN) {
        reject(new Error('too short length for ICMP'));
      }

      let type = reader.readUInt8(0)
        , code = reader.readUInt8(1)
        , checksum = `0x${reader.toString('hex', 2, 4)}`
        , id       = reader.readUInt16BE(4)
        , sequence = reader.readUInt16BE(6)
        , payload  = (reader.length > ICMP.HEADER_LEN_MIN)
                     ? reader.toString('utf8', ICMP.HEADER_LEN_MIN) : null
        ;

      resolve({
        core: {
          type, code, checksum, id, sequence
        },
        next: {
          protocol: null,
          payload:  payload
        }
      });
    });
  }
}
