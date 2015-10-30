// Interface Description Block (mandatory)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionidb

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extract_optionsJs = require('./extract_options.js');

var _extract_optionsJs2 = _interopRequireDefault(_extract_optionsJs);

exports['default'] = function (reader) {
  var block_len = reader.readUInt32(4),
      cur_block = reader.slice(0, block_len),
      trailer = cur_block.readUInt32(block_len - 4);

  if (block_len !== trailer) {
    throw { msg: 'imcompatible block length' };
  }

  var link_type = cur_block.readUInt16(8),
      snap_len = cur_block.readUInt32(12),
      map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Device', type: 'utf8' }], [9, { name: 'Resolution', type: 'uint8' }], [12, { name: 'OS', type: 'utf8' }]]);

  var ret = {
    block_type: 'Interface Description',
    link_type: link_type,
    options: (0, _extract_optionsJs2['default'])(cur_block.slice(16, -4), map)
  };

  reader.next(block_len);
  return ret;
};

module.exports = exports['default'];