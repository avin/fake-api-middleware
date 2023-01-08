# Fake-Api-Middleware

[Express](https://github.com/expressjs/express)+[Connect](https://github.com/senchalabs/connect) middleware. Can be used with [Webpack DevServer](https://github.com/webpack/webpack-dev-server) and [Vite](https://github.com/vitejs/vite).

- 🔩 Compatible with [Express](https://github.com/expressjs/express)+[Connect](https://github.com/senchalabs/connect)
- 🛠️ Write dummy responses with JS/TS
- 🔥 Hot dummies reload

## Install

```sh
npm install fake-api-middleware
```

## Usage

Create a file with the response-dummies. This can be either JS or TS.

`./apiDummies/index.ts`: 
```ts
export default {
  // The response can be like a normal JS object which will be returned as JSON with status 200
  'GET /api/users': [
    {id: 1, name: 'Bob'},
    {id: 2, name: 'Jack'},
    {id: 3, name: 'Mike'},
  ],
  // Or as a function that returns a JS object which will also be returned as a JSON response with code 200
  'POST /api/createUser': ({ body, query, headers, req, res }) => {
    return {
      success: true,
      message: `User ${body.name} created`
    };
  },
  // Or as a function that prepare an HTTP response manually
  'POST /api/processData': ({ body, query, headers, req, res }) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        success: true,
        additional: {
          body,
          query,
          headers,
        },
        message: 'It is response made with ServerResponse',
      }),
    );
  },
};
```

Setup middleware for HTTP server with the path to the stub file (this example uses Connect server, check more examples below)

`./server.js`:
```js
var connect = require('connect');
var http = require('http');
const { middleware: fakeApiMiddleware } = require('fake-api-middleware');
 
var app = connect();

app.use(
  fakeApiMiddleware({
    responsesFile: './apiDummies/index.ts',
  }),
);

http.createServer(app).listen(3000);
```


## API

Middleware options:

* `responsesFile`: (`string` **required**) - Path for API dummies file;
* `watchFiles`: (`string[]`) - Folders/Files to watch for updates to reload dummies file. By default, it only watches at single `responsesFile`;
* `responseDelay`: (`number`) - Delay in ms for each dummy response;

Dummy response function options:

* `body`: `Record<string, any>` - Object with parsed body from request;
* `query`: `Record<string, any>` - Object with parsed query params of requested url;
* `headers`: `Record<string, any>` - Object with request headers;
* `req`: `IncomingMessage` - Raw Node.JS HTTP [IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) object;
* `res`: `ServerResponse` - Raw Node.JS HTTP [ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) object;

## Setup examples

### Express

```js
const express = require('express');
const { middleware: fakeApiMiddleware } = require('fake-api-middleware');

const app = express();

app.use(
  fakeApiMiddleware({
    responsesFile: './apiDummies/index.js',
  }),
);

app.listen(8080);
```

### Vite

Use built-in plugin for vite in `vite.config.js`

```ts
import { defineConfig } from 'vite';
import { vitePlugin as fakeResponseVitePlugin } from 'fake-api-middleware';

export default defineConfig({
  plugins: [
    fakeResponseVitePlugin({
      responsesFile: './apiDummies/index.ts',
    }),
  ],
});
```

### Create-React-App

Create `setupProxy.js` in `src` folder with content (`apiDummies` folder should be in project root):

```js
const { middleware: fakeApiMiddleware } = require('fake-api-middleware');

module.exports = function (app) {
  app.use(
    fakeApiMiddleware({
      responsesFile: './apiDummies/index.js',
    }),
  );
};
```

### Webpack

In webpack config create/modify `devServer` section with `before` rule:

```js
const { middleware: fakeApiMiddleware } = require('fake-api-middleware');

module.exports = {
  // ...
  devServer: {
    // ...
    before(app) {
      app.use(
        fakeApiMiddleware({
          responsesFile: './apiDummies/index.js',
        }),
      );
    },
  },
  // ...
};
```
