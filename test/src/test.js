import eshark from '../../bin/index.js';

if (eshark() == 1) {
  console.log('passed');
} else {
  console.log('failed: ', eshark());
}
