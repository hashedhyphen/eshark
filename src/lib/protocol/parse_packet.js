export default (reader, start, cap_len) => {
  let packet = reader.slice(start, start + cap_len);
  return packet.toString('hex');
};
