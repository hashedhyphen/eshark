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
      trailer = cur_block.readUInt32(block_len - 4);

  if (block_len !== trailer) {
    throw { msg: 'imcompatible block length' };
  }

  var link_type = cur_block.readUInt16(8),
      snap_len = cur_block.readUInt32(12),
      map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Device', type: 'utf8' }], [8, { name: 'IFSpeed', type: 'uint64' }], [9, { name: 'Resolution', type: 'uint8' }], [12, { name: 'OS', type: 'utf8' }], [13, { name: 'FCSLength', type: 'uint8' }], [14, { name: 'TSOffset', type: 'uint64' }]]);

  var ret = {
    block_type: 'Interface Description',
    link_type: link_type,
    options: (0, _extract_options2.default)(cur_block.slice(16, -4), map)
  };

  reader.next(block_len);
  return ret;
}; // Interface Description Block (mandatory)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionidb