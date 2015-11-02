import fs from 'fs';
import BufferReader from '../../bin/lib/shared/buffer_reader.js';
import tcp          from '../../bin/lib/protocol/tcp.js';

let file_path = 'test/tcp.bin';

fs.readFile(file_path, (err, buf) => {
  console.log(tcp(new BufferReader(buf, 'pcapng', 'little')));
});
