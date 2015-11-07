'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _binLibSharedBuffer_readerJs = require('../../bin/lib/shared/buffer_reader.js');

var _binLibSharedBuffer_readerJs2 = _interopRequireDefault(_binLibSharedBuffer_readerJs);

var _binLibProtocolIcmpJs = require('../../bin/lib/protocol/icmp.js');

var _binLibProtocolIcmpJs2 = _interopRequireDefault(_binLibProtocolIcmpJs);

var file_path = 'test/icmp_reply.bin';

_fs2['default'].readFile(file_path, function (err, buf) {
  console.log((0, _binLibProtocolIcmpJs2['default'])(new _binLibSharedBuffer_readerJs2['default'](buf, 'pcapng', 'little')));
});