export default (reader) => {
  return new Promise((resolve, reject) => {
    const HEADER_LEN_MIN = 8;
    if (reader.length < HEADER_LEN_MIN) {
      reject(Error('too short length for UDP'));
    }

    let source      = reader.buf.readUInt16BE(0)
      , destination = reader.buf.readUInt16BE(2)
      , header_len  = reader.buf.readUInt16BE(4)
      , checksum    = `0x${reader.toString('hex', 6, 8)}`
      , data        = (reader.length > HEADER_LEN_MIN) ?
                      reader.slice(header_len) : null;

    resolve({ source, destination, header_len, checksum, data });
  });
};
