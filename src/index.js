import fs from 'fs';
import PcapngParser from './lib/pcapng_parser.js'

let readFile = (file_path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, (err, buf) => {
      if (err) { reject(err); }
      else { resolve(buf); }
    });
  });
}

export default (file_path) => {
  return new Promise((resolve, reject) => {
    readFile(file_path).then((buf) => {
      resolve(new PcapngParser(buf));
    }).catch((err) => {
      reject(err);
    });
  });
}
