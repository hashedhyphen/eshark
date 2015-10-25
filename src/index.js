import fs from 'fs';
import PcapngParser from './lib/pcapng_parser.js';

let createParser = (file_path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file_path, (err, buf) => {
      if (err) { reject(err); }
      else { resolve(new PcapngParser(buf)); }
    });
  });
};

export default (file_path) => {
  return new Promise((resolve, reject) => {
    createParser(file_path).then((parser) => {
      resolve(parser.parse());
    }).catch((err) => {
      reject(err);
    });
  });
};
