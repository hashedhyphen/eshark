export default (reader) => {
  return new Promise((resolve, reject) => {
    const HEADER_LEN = 14;
    if (reader.length < HEADER_LEN) {
      reject(Error('too short length for Ethernet'));
    }

    let destination = getMACAddress(reader, 0)
      , source      = getMACAddress(reader, 6)
      , ether_type  = ETHER_TYPES.get(reader.toString('hex', 12, 14))
      , payload     = reader.length > HEADER_LEN ? reader.slice(14) : null;

    resolve({ destination, source, ether_type, payload });
  });
};

let getMACAddress = (reader, start) => {
  let chunk = reader.buf.slice(start, start + 6)
    , bytes = [];

  for (let b of chunk) {
    let hex = b.toString(16);
    bytes.push(b < 0x10 ? `0${hex}` : hex);
  }

  return bytes.join(':');
};

const ETHER_TYPES = new Map([
  ['0800', 'Internet Protocol Version 4'],
  ['86dd', 'Internet Protocol Version 6']
]);
