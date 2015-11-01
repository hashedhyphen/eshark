'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _binLibSharedBuffer_readerJs = require('../../bin/lib/shared/buffer_reader.js');

var _binLibSharedBuffer_readerJs2 = _interopRequireDefault(_binLibSharedBuffer_readerJs);

var _binLibProtocolIpv4Js = require('../../bin/lib/protocol/ipv4.js');

var _binLibProtocolIpv4Js2 = _interopRequireDefault(_binLibProtocolIpv4Js);

var file_path = 'test/ipv4.bin';

_fs2['default'].readFile(file_path, function (err, buf) {
  console.log((0, _binLibProtocolIpv4Js2['default'])(new _binLibSharedBuffer_readerJs2['default'](buf, 'pcapng', 'little')));
});