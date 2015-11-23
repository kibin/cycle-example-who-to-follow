'use strict';

let path = require('path');
let express = require('express');
let webpack = require('webpack');
let config = require('./webpack.config');

let app = express();
let compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', (err) => {
  if (err) return console.error(err);

  console.info('Listening at http://localhost:3000');
});
