import fs from 'fs';
import PcapParser   from './pcap_parser.js';
import PcapngParser from './pcapng_parser.js';

let readFile = (file_path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, (err, buf) => {
      if (err) { reject(err);  }
      else     { resolve(buf); }
    });
  });
};

let createParser = (buf) => {
  return new Promise((resolve, reject) => {
    let leader = buf.toString('hex', 0, 4);
    switch (leader) {
      case '0a0d0d0a':
        resolve(new PcapngParser(buf));
        break;
      case 'd4c3b2a1':
      case 'a1b2c3d4':
        resolve(new PcapParser(buf));
        break;
      default:
        reject(new Error({ msg: 'unknown magic number' }));
    }
  });
};

export default (file_path) => {
  return new Promise((resolve, reject) => {
    readFile(file_path)
    .then(createParser)
    .then((parser) => { resolve(parser.parse()); })
    .catch((err)   => { reject(err); });
  });
};
