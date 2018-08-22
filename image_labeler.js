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
  var st = num.toString();
  if(st.length > size) throw "bad input / target size must be able to fit input number";
  while(st.length < size) {
    st = "0" + st;
  }
  return st;
}

function generate_filename(num) {
  return "./output/images/REAL_WORLD_" + lead_number(sample_num, 4) + ".jpg";
}

function annotation_filename(num) {
  return "./output/annotations/REAL_WORLD_" + lead_number(sample_num, 4) + ".xml";
}

var sample_num = 0;

function next_file() {
  if(!fs.existsSync('./output')) {
    fs.mkdirSync('./output');
    fs.mkdirSync('output/images');
    fs.mkdirSync('output/annotations');
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
    var x = parseInt(req.query.x);
    var y = parseInt(req.query.y);
    var w = parseInt(req.query.w);
    var h = parseInt(req.query.h);
    console.log({file: filename, x: x, y: y, w: w, h: h});
    var voc = fs.readFileSync('./voc.xml').toString();
    voc = voc.replace('{{x1}}', x);
    voc = voc.replace('{{y1}}', y);
    voc = voc.replace('{{x2}}', w + x);
    voc = voc.replace('{{y2}}', h + y);
    voc = voc.replace('{{image_width}}', info.width);
    voc = voc.replace('{{image_height}}', info.height);
    voc = voc.replace('{{filename}}', filename);
    fs.writeFileSync(annotation_filename(sample_num), voc);
    res.status(200).send('OK');
  });
});

app.listen(8080, () => console.log('server listening at localhost:8080'));