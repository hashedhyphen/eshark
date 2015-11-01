import fs from 'fs';
import BufferReader from '../../bin/lib/shared/buffer_reader.js';
import ethernet     from '../../bin/lib/protocol/ethernet.js';

let file_path = 'test/packet.bin';

fs.readFile(file_path, (err, buf) => {
  console.log(ethernet(new BufferReader(buf, 'pcapng', 'little')));
});
