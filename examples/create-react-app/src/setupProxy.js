const foo = require('../../../dist/index.cjs');

console.log(foo);

module.exports = function (app) {
  // app.use(fakeResponseMiddleware({
  //   responsesFile: './apiMock/index.js',
  //   watchFiles: ['./apiMock/*'],
  // }))
  //
  // process.exit(0);
};
