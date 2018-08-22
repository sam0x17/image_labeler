const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const express = require('express');

// gather input files
if(!fs.existsSync('./input')) fs.mkdirSync('./input');
var dir = process.cwd();
var files = new Array();
console.log();
console.log('scanning input directory...')
fs.readdirSync('./input').forEach((filename) => {
  console.log(filename);
  files.push('./input/' + filename);
});
console.log();

function lead_number(num, size) {
  var st = num + "";
  if(st.length > size) throw "bad input / target size must be able to fit input number";
  while(st.length < num) {
    st = "0" + st;
  }
  return st;
}

function generate_filename(num) {
  return "./output/REAL_WORLD_" + lead_number(sample_num, 4) + ".jpg";
}

var sample_num = 0;

function next_file() {
  if(!fs.existsSync('./output')) {
    fs.mkdirSync('./output');
    sample_num = 0;
  } else {
    while(fs.existsSync(generate_filename(sample_num))) {
      sample_num++;
    }
  }
}

const app = express();

app.get('/', (req, res) => {
  var html = fs.readFileSync('./index.html').toString();
  html = html.replace('{{files}}', JSON.stringify(files));
  res.status(200).send(html);
});

app.use('/input', express.static('input'));

app.get('/save', (req, res) => {
  next_file();
  var filename = req.query.filename;
  var src_path = './input/' + filename;
  var dest_path = generate_filename(sample_num);
  sharp(src_path).resize(1000).toFile(dest_path, function(err, info) {
    if(err) throw err;
    if(info) console.log(info)
    // TODO: write metadata file
    res.status(200).send('OK');
  });
});

app.listen(8080, () => console.log('server listening at localhost:8080'));