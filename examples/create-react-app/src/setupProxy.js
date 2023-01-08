const { middleware: fakeResponseMiddleware } = require('../../../dist/index');
const path = require('path');

module.exports = function (app) {
  app.use(
    fakeResponseMiddleware({
      responsesFile: './apiMock/index.js',
      watchFiles: ['./apiMock/*'],
      responseDelay: 500,
    }),
  );
};
