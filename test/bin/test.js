'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _binIndexJs = require('../../bin/index.js');

var _binIndexJs2 = _interopRequireDefault(_binIndexJs);

var file_name = '../log.pcapng';
var buf = (0, _binIndexJs2['default'])(file_name);
console.log(buf);