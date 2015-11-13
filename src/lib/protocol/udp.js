export default class UDP {
  static get HEADER_LEN_MIN() {
    return 8;
  }

  static parse(reader) {
    return new Promise((resolve, reject) => {
      if (reader.length < UDP.HEADER_LEN_MIN) {
        reject(Error('too short length for UDP'));
      }

      let source      = reader.readUInt16BE(0)
        , destination = reader.readUInt16BE(2)
        , header_len  = reader.readUInt16BE(4)
        , checksum    = `0x${reader.toString('hex', 6, 8)}`
        , payload     = (reader.length > UDP.HEADER_LEN_MIN)
                        ? reader.slice(UDP.HEADER_LEN_MIN) : null
        ;

      resolve({
        core: {
          source, destination, header_len, checksum
        },
        next: {
          protocol: null,
          payload:  payload
        }
      });
    });
  }
}
