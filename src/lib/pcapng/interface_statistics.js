// Interface Statistics Block (optional)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionisb

import extractOptions from './extract_options.js';

export default (reader) => {
  let block_len = reader.readUInt32(4)
    , cur_block = reader.slice(0, block_len)
    , trailer   = cur_block.readUInt32(block_len - 4);

  if (block_len !== trailer) {
    throw { msg: 'imcompatible block length' };
  }

  let interface_id   = cur_block.readUInt32(8)
    , timestamp_high = cur_block.readUInt32(12)
    , timestamp_low  = cur_block.readUInt32(16)
    , map = new Map([
        [1, { name: 'Comment',    type: 'utf8' }],
        [2, { name: 'StartTime',  type: 'utf8' }],
        [3, { name: 'EndTime',    type: 'utf8' }],
        [4, { name: 'Recieved',   type: 'utf8' }],
        [5, { name: 'DropedByIF', type: 'utf8' }],
        [6, { name: 'Accepted',   type: 'utf8' }],
        [7, { name: 'DropedByOS', type: 'utf8' }],
        [8, { name: 'Delivered',  type: 'utf8' }]
      ]);

  let ret = {
    block_type: 'Interface Statistics',
    interface_id,
    timestamp_high,
    timestamp_low,
    options:    extractOptions(cur_block.slice(20, -4), map)
  };

  reader.next(block_len);
  return ret;
};
