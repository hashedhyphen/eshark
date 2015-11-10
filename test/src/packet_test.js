import 'babel-polyfill';
import fs from 'fs';

import BufferReader from '../../bin/lib/shared/buffer_reader.js';
import PacketParser from '../../bin/lib/shared/packet_parser.js';

let file_path = 'test/data/ethernet.bin';

fs.readFile(file_path, async (err, buf) => {
  let reader = new BufferReader(buf, 'pcapng', 'little')
    , result = await PacketParser.parse(reader);
  console.log(result);
});
