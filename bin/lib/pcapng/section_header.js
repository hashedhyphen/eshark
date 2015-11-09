'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extract_options = require('./extract_options.js');

var _extract_options2 = _interopRequireDefault(_extract_options);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (reader) {
  var block_len = reader.readUInt32(4),
      cur_block = reader.slice(0, block_len),
      trailer = cur_block.readUInt32(-4);

  if (block_len !== trailer) {
    throw new Error('imcompatible block length');
  }

  var major_ver = cur_block.readUInt16(12),
      minor_ver = cur_block.readUInt16(14),
      map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Hardware', type: 'utf8' }], [3, { name: 'OS', type: 'utf8' }], [4, { name: 'Application', type: 'utf8' }]]);

  var ret = {
    block_type: 'SectionHeader',
    version: major_ver + '.' + minor_ver,
    options: (0, _extract_options2.default)(cur_block.slice(24, -4), map)
  };

  reader.next(block_len);
  return ret;
}; // Section Header Block (mandatory)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionshb