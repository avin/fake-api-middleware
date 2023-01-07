// var http = require('http');

export const vitePlugin = () => {
  return {
    name: 'vite-plugin-fake-response',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        console.log(req.url);
        if (req.url.startsWith('/foo')) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ foo: 'foo is here!' }));
        }
        if (req.url.startsWith('/api/test')) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ test: 'it is from middleware' }));
        }
        if (req.url.startsWith('/joo')) {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ joo: 'it is from middleware', req: req.url }));
        }
        return next();
      });
    },
  };
};
