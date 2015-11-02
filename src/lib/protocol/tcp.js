export default (reader) => {
  const HEADER_LEN_MIN = 20;
  if (reader.length < HEADER_LEN_MIN) {
    throw new Error('too short length for Ethernet');
  }

  let source      = reader.buf.readUInt16BE(0)
    , destination = reader.buf.readUInt16BE(2)
    , seq_num     = reader.buf.readUInt32BE(4)
    , ack_num     = reader.buf.readUInt32BE(8)
    , header_len  = (reader.readUInt8(12) >>> 4) * 4
    , flags       = getTCPFlags(reader.readUInt8(13) & 0x3f)
    , window_size = reader.buf.readUInt16BE(14)
    , checksum    = `0x${reader.toString('hex', 16, 18)}`
    , urgent_ptr  = reader.buf.readUInt16BE(18)
    , options     = /*(header_len == HEADER_LEN_MIN) ?*/ null
    , data        = (reader.length > HEADER_LEN_MIN) ?
                    reader.slice(header_len) : null;

  return { source, destination, seq_num, ack_num, header_len,
           flags, window_size, checksum, urgent_ptr, options, data };
};

let getTCPFlags = (bits) => {
  return {
    urg: +!!(bits & 0x20), ack: +!!(bits & 0x10),
    psh: +!!(bits & 0x08), rst: +!!(bits & 0x04),
    syn: +!!(bits & 0x02), fin: +!!(bits & 0x01)
  };
};
