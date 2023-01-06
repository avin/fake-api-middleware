// var http = require('http');

export const vitePlugin = () => {
  return {
    name: 'vite-plugin-fake-response',
    configureServer(server) {

      // const res = Object.create(http.ServerResponse.prototype)

      console.log(server);
      process.exit(0);

      server.middlewares.use((req, res, next) => {
        console.log(req.url);
        if(req.url.startsWith('/api')){
          console.log(res);
          return res.end(JSON.stringify({foo: 'bar'}));
        }
        return next();
      });
    },
  };
};
