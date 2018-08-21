const sharp = require('sharp');
const fs = require('fs');
const http = require('http');

const index = fs.readFileSync('./index.html');

console.log('started server at localhost:8080');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
}).listen(8080);
