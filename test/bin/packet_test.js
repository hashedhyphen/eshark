'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _binLibSharedBuffer_readerJs = require('../../bin/lib/shared/buffer_reader.js');

var _binLibSharedBuffer_readerJs2 = _interopRequireDefault(_binLibSharedBuffer_readerJs);

var _binLibProtocolUdpJs = require('../../bin/lib/protocol/udp.js');

var _binLibProtocolUdpJs2 = _interopRequireDefault(_binLibProtocolUdpJs);

var file_path = 'test/udp.bin';

_fs2['default'].readFile(file_path, function (err, buf) {
  console.log((0, _binLibProtocolUdpJs2['default'])(new _binLibSharedBuffer_readerJs2['default'](buf, 'pcapng', 'little')));
});