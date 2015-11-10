import 'babel-polyfill';

import Ethernet from '../protocol/ethernet.js';

export default class PacketParser {
  static parse(reader) {
    return new Promise(async (resolve, reject) => {
      let ethernet = await new Ethernet(reader).parse();
      resolve(ethernet);
    });
  }
};
