import { defineConfig } from 'vite';
import zlib from 'zlib';
import { vitePlugin as fakeResponseVitePlugin } from '../../dist/index';

export default defineConfig({
  // plugins: [fakeResponseVitePlugin()],
  server: {
    proxy: {
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        selfHandleResponse: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res, options) => {
            // Check if the request matches a certain route
            console.log(req.url, req.method);
            if (req.url.startsWith('/test')) {
              // Return mock data instead of forwarding the request
              res.end('{"foo": "bar"}');
              proxyReq.emit('close');
            }
          });

          proxy.on('proxyRes', function (proxyRes, req, res) {
            console.log('FIRE!');
            let originalBody = new Buffer('');
            proxyRes.on('data', function (data) {
              originalBody = Buffer.concat([originalBody, data]);
            });
            proxyRes.on('end', function () {
              const bodyString = zlib.gunzipSync(originalBody).toString('utf8');
              res.end(
                JSON.stringify({
                  author: 'avin',
                  bodyString,
                }),
              );
            });
          });
        },
      },
    },
  },
});
