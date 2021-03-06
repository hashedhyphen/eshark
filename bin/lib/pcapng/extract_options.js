'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Helper module for Options
// https://www.winpcap.org/ntar/draft/PCAP-DumpFileFormat.html#sectionopt

exports.default = function (reader, map) {
  return (function extractOptions() {
    var container = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var code = reader.readUInt16(0);

    if (code === 0) {
      if (reader.length === 4) {
        return container;
      } else {
        throw new Error('options not terminated');
      }
    }

    var option_len = reader.readUInt16(2),
        padding_len = option_len % 4 === 0 ? 0 : 4 - option_len % 4,
        name = map.get(code) ? map.get(code).name : 'unknown',
        type = map.get(code) ? map.get(code).type : null,
        value = undefined;

    switch (type) {
      case 'uint8':
        value = reader.readUInt8(4);
        break;
      case 'uint32':
        value = reader.readUInt32(4);
        break;
      case 'uint64':
        value = '' + reader.readUInt32(4) + reader.readUInt32(8);
        break;
      case 'utf8':
        value = reader.toString('utf8', 4, 4 + option_len);
        break;
      case 'hex':
        value = reader.toString('hex', 4, 4 + option_len);
        break;
      default:
        value = reader.toString('utf8', 4, 4 + option_len);
    }
    container[name] = value;

    reader.next(4 + option_len + padding_len);
    return extractOptions(container);
  })();
};