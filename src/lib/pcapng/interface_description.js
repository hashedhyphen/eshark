// Interface Description Block (mandatory)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionidb

import extractOptions from './extract_options.js';

export default (reader) => {
  let block_len = reader.readUInt32(4)
    , cur_block = reader.slice(0, block_len)
    , trailer   = cur_block.readUInt32(block_len - 4);

  if (block_len !== trailer) {
    throw { msg: 'imcompatible block length' };
  }

  let link_type = cur_block.readUInt16(8)
    , snap_len  = cur_block.readUInt32(12)
    , map = new Map([
        [1,  { name: 'Comment',    type: 'utf8' }],
        [2,  { name: 'Device' ,    type: 'utf8' }],
        [9,  { name: 'Resolution', type: 'uint8'}],
        [12, { name: 'OS',         type: 'utf8' }]
      ]);

  let ret = {
    block_type: 'Interface Description',
    link_type:  link_type,
    options:    extractOptions(cur_block.slice(16, -4), map)
  };

  reader.next(block_len);
  return ret;
};
