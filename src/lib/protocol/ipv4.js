export default (reader) => {
  return new Promise((resolve, reject) => {
    const HEADER_LEN = 20;
    if (reader.length < HEADER_LEN) {
      reject(new Error('too short length for IPv4'));
    }

    let version     = reader.readUInt8(0) >>> 4
      , ihl         = (reader.readUInt8() & 0xf) * 4  // in bytes
      , service     = `0x${reader.toString('hex', 1, 2)}`
      , total_len   = reader.readUInt16(3)
      , id          = `0x${reader.toString('hex', 4, 6)}`
      , flags       = reader.readUInt8(6) >>> 5
      , offset      = (reader.readUInt8(6)&0x1)*0x100 + reader.readUInt8(7)
      , ttl         = reader.readUInt8(8)
      , protocol    = PROTOCOLS.get(reader.readUInt8(9))
      , checksum    = `0x${reader.toString('hex', 10, 12)}`
      , source      = getIPv4Address(reader, 12)
      , destination = getIPv4Address(reader, 16)
      , payload     = reader.length > HEADER_LEN ? reader.slice(ihl) : null;


    resolve({ version, ihl, service, total_len, id,
             flags, offset, ttl, protocol, checksum,
             source, destination, payload });
  });
};

let getIPv4Address = (reader, start) => {
  let chunk = reader.buf.slice(start, start + 4)
    , bytes = [];

  for (let b of chunk) { bytes.push(b); }
  return bytes.join('.');
};

const PROTOCOLS = new Map([
  [1,  'ICMP'],
  [6,  'TCP' ],
  [17, 'UDP' ]
]);
