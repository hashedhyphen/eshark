export default (reader) => {
  const HEADER_LEN_MIN = 8;
  if (reader.length < HEADER_LEN_MIN) {
    throw new Error('too short length for ICMP');
  }

  let type = reader.buf.readUInt8(0)
    , code = reader.buf.readUInt8(1)
    , checksum = `0x${reader.toString('hex', 2, 4)}`
    , id       = reader.buf.readUInt16BE(4)
    , sequence = reader.buf.readUInt16BE(6)
    , data     = (reader.length > HEADER_LEN_MIN) ?
                 reader.toString('utf8', HEADER_LEN_MIN) : null;

  return { type, code, checksum, id, sequence, data };
};
