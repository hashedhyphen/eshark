// Interface Statistics Block (optional)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionisb

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

  var interface_id = cur_block.readUInt32(8),
      timestamp_high = cur_block.readUInt32(12),
      timestamp_low = cur_block.readUInt32(16),
      map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'StartTime', type: 'utf8' }], [3, { name: 'EndTime', type: 'utf8' }], [4, { name: 'Recieved', type: 'utf8' }], [5, { name: 'DropedByIF', type: 'utf8' }], [6, { name: 'Accepted', type: 'utf8' }], [7, { name: 'DropedByOS', type: 'utf8' }], [8, { name: 'Delivered', type: 'utf8' }]]);

  var ret = {
    block_type: 'Interface Statistics',
    interface_id: interface_id,
    timestamp_high: timestamp_high,
    timestamp_low: timestamp_low,
    options: (0, _extract_optionsJs2['default'])(cur_block.slice(20, -4), map)
  };

  reader.next(block_len);
  return ret;
};

module.exports = exports['default'];