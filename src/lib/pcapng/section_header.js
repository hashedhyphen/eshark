// Section Header Block (mandatory)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionshb

import extractOptions from './extract_options.js';

export default (reader) => {
  let block_len = reader.readUInt32(4)
    , cur_block = reader.slice(0, block_len)
    , trailer   = cur_block.readUInt32(-4);

  if (block_len !== trailer) {
    throw new Error('imcompatible block length');
  }

  let major_ver = cur_block.readUInt16(12)
    , minor_ver = cur_block.readUInt16(14)
    , map = new Map([
        [1, { name: 'Comment',     type: 'utf8' }],
        [2, { name: 'Hardware' ,   type: 'utf8' }],
        [3, { name: 'OS',          type: 'utf8' }],
        [4, { name: 'Application', type: 'utf8' }]
      ]);

  let ret = {
    block_type: 'SectionHeader',
    version:    `${major_ver}.${minor_ver}`,
    options:    extractOptions(cur_block.slice(24, -4), map)
  };

  reader.next(block_len);
  return ret;
};
