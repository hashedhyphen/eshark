// Enhanced Packet Block (optional)
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionepb

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _extract_optionsJs = require('./extract_options.js');

var _extract_optionsJs2 = _interopRequireDefault(_extract_optionsJs);

var _protocolParse_packetJs = require('../protocol/parse_packet.js');

var _protocolParse_packetJs2 = _interopRequireDefault(_protocolParse_packetJs);

exports['default'] = function (reader) {
  var block_len = reader.readUInt32(4),
      cur_block = reader.slice(0, block_len),
      trailer = cur_block.readUInt32(block_len - 4);

  if (block_len !== trailer) {
    throw { msg: 'imcompatible block length' };
  }

  var interface_id = reader.readUInt32(8),
      timestamp_high = reader.readUInt32(12),
      timestamp_low = reader.readUInt32(16),
      captured_length = reader.readUInt32(20),
      packet_length = reader.readUInt32(24),
      packet_data = (0, _protocolParse_packetJs2['default'])(reader, 28, captured_length),
      map = new Map([[1, { name: 'Comment', type: 'utf8' }], [2, { name: 'Flags', type: 'uint32' }]]);

  var ret = {
    block_type: 'Enhanced Packet',
    interface_id: interface_id,
    timestamp_high: timestamp_high,
    timestamp_low: timestamp_low,
    captured_length: captured_length,
    packet_length: packet_length,
    packet_data: packet_data,
    options: {}
  };

  reader.next(block_len);
  return ret;
};

module.exports = exports['default'];