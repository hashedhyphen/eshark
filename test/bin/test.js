'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _binIndexJs = require('../../bin/index.js');

var _binIndexJs2 = _interopRequireDefault(_binIndexJs);

if ((0, _binIndexJs2['default'])() == 1) {
  console.log('passed');
} else {
  console.log('failed: ', (0, _binIndexJs2['default'])());
}