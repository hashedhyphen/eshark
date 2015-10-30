// Enhanced Packet Block (optional)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionepb

import extractOptions from './extract_options.js';
import parsePacket    from '../protocol/parse_packet.js';

export default (reader) => {
  let block_len = reader.readUInt32(4)
    , cur_block = reader.slice(0, block_len)
    , trailer   = cur_block.readUInt32(block_len - 4);

  if (block_len !== trailer) {
    throw { msg: 'imcompatible block length' };
  }

  let interface_id    = reader.readUInt32(8)
    , timestamp_high  = reader.readUInt32(12)
    , timestamp_low   = reader.readUInt32(16)
    , captured_length = reader.readUInt32(20)
    , packet_length   = reader.readUInt32(24)
    , packet_data     = parsePacket(reader, 28, captured_length)
    , map = new Map([
        [1, { name: 'Comment', type: 'utf8'   }],
        [2, { name: 'Flags'  , type: 'uint32' }]
      ]);

  let ret = {
    block_type: 'Enhanced Packet',
    interface_id,
    timestamp_high,
    timestamp_low,
    captured_length,
    packet_length,
    packet_data,
    options: {}
  };

  reader.next(block_len);
  return ret;
};
