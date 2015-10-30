import BufferReader         from './lib/share/buffer_reader.js';
import sectionHeader        from './lib/pcapng/section_header.js';
import interfaceDescription from './lib/pcapng/interface_description.js';
import enhancedPacket       from './lib/pcapng/enhanced_packet.js';

export default class PcapngParser {
  constructor (buf) {
    this.reader = new BufferReader(buf, 'pcapng');
  }

  parse () {
    let blocks = [];
    while (this.reader.length > 0) {
      let block_type = this.reader.readUInt32();
      switch (block_type) {
        case 0x0a0d0d0a:
          blocks.push(sectionHeader(this.reader));
          break;
        case 0x00000001:
          blocks.push(interfaceDescription(this.reader));
          break;
        case 0x00000006:
          blocks.push(enhancedPacket(this.reader));
          break;
        default:
          console.log(`unknown block_type ${block_type}`);
          return blocks; // skip();
      }
    }
    return blocks;
  }
}
