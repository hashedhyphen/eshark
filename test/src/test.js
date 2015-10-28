import eshark from '../../bin/router.js';

let file_path = process.argv[2];

eshark(file_path).then((buf) => {
  console.log('resolved:');
  console.log(buf);
}).catch((err) => {
  console.error('error:');
  console.error(err);
});
