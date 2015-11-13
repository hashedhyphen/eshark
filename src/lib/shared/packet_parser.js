import 'babel-polyfill';

import Ethernet from '../protocol/ethernet.js';
import IPv4     from '../protocol/ipv4.js';
import ICMP     from '../protocol/icmp.js';
import TCP      from '../protocol/tcp.js';
import UDP      from '../protocol/udp.js';

let PARSERS = new Map([
  ['Ethernet', Ethernet],
  ['IPv4', IPv4],
  ['ICMP', ICMP],
  ['TCP', TCP],
  ['UDP', UDP]
]);

export default class PacketParser {
  static parse(reader) {
    return new Promise(async (resolve, reject) => {
      let protocol = 'Ethernet'
        , payload  = reader
        , results  = [];

      while (true) {
        let result = await PARSERS.get(protocol).parse(payload);
        results.push({
          type: protocol,
          spec: result.core
        });

        if (result.next.protocol) {
          protocol = result.next.protocol;
          payload  = result.next.payload;
          continue;
        }

        results.push({
          type: 'data',
          spec: result.next.payload.toString('hex')
        });
        break;
      }

      resolve(results);
    });
  }
}
