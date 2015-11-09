import 'babel-polyfill';
import fs from 'fs';

import BufferReader from '../../bin/lib/shared/buffer_reader.js';
import icmp         from '../../bin/lib/protocol/icmp.js';

let file_path = 'test/icmp_reply.bin';

fs.readFile(file_path, async (err, buf) => {
  let result = await icmp(new BufferReader(buf, 'pcapng', 'little'));
  console.log(result);
});
