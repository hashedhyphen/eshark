import fs from 'fs';
import BufferReader from '../../bin/lib/shared/buffer_reader.js';
import udp          from '../../bin/lib/protocol/udp.js';

let file_path = 'test/udp.bin';

fs.readFile(file_path, (err, buf) => {
  console.log(udp(new BufferReader(buf, 'pcapng', 'little')));
});
