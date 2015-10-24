import fs from 'fs';

export default function (file_name) {
  fs.readFile(file_name, (err, buf) => {
    if (err) console.error(err);
    return console.log(buf);
  });
}
