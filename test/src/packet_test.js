import fs from 'fs';
import BufferReader from '../../bin/lib/shared/buffer_reader.js';
import ipv4         from '../../bin/lib/protocol/ipv4.js';

let file_path = 'test/ipv4.bin';

fs.readFile(file_path, (err, buf) => {
  console.log(ipv4(new BufferReader(buf, 'pcapng', 'little')));
});
