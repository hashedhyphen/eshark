export default class {
  static align32bits (bytes) {
    if (bytes % 4 === 0) { return bytes;   }
    else { return bytes + (4 - bytes % 4); }
  }
}
