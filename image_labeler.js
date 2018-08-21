const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

function resolvePath(file) {
  return path.join(__dirname, file);
}

app.get('/', (req, res) => {
  res.sendFile(resolvePath('index.html'));
});

app.listen(8080, () => console.log('server listening at localhost:8080'));