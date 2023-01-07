const express = require('express');
const { middleware } = require('../../dist/index');

const app = express();

app.use(
  middleware({
    responsesFile: './apiMock/index.js',
  }),
);

app.listen(8080);
