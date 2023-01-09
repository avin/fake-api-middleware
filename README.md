# Fake-Api-Middleware

[Express](https://github.com/expressjs/express)+[Connect](https://github.com/senchalabs/connect) middleware. Can be used with [Vite](https://github.com/vitejs/vite), [Webpack DevServer](https://github.com/webpack/webpack-dev-server), [CreateReactApp](https://github.com/facebook/create-react-app) and many more that based on NodeJS Connect/Express server.

- 🔩 Compatible with [Express](https://github.com/expressjs/express)+[Connect](https://github.com/senchalabs/connect)
- 🛠️ Write dummy responses with JS/TS
- 🔥 Hot dummies reload

## Install

```sh
npm install fake-api-middleware
```

## Usage

Create a file with the response-dummies. It can be either _JS_ or _TS_.

`./apiDummies/index.ts`: 
```ts
import { delay } from 'fake-api-middleware';
import type { ResponseFunctionParams } from 'fake-api-middleware';

export default {
  // The response can be like a normal JS object which will be returned as JSON with status 200
  'GET /api/users': [
    {id: 1, name: 'Bob'},
    {id: 2, name: 'Jack'},
    {id: 3, name: 'Mike'},
  ],
  
  // The response can be a function that returns a JS object which will also be returned as a JSON response with code 200
  'POST /api/createUser': ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    return {
      message: `User ${body.name} created`
    };
  },
  
  // It is possible to change the response status code using the `res` object
  'GET /api/unknown': ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    res.statusCode = 404;
    return {
      message: `Route does not exist`
    };
  },
  
  // API path can contain special regexp syntax
  // See https://www.npmjs.com/package/path-to-regexp
  'GET /api/users/:id': ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    return {
      message: `User with id ${params.id} is here`
    };
  },
  
  // It is possible to do async responses
  'GET /api/async': async ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    await delay(1000);
    return {
      message: `Hello!`
    };
  },
  
  // Or the response can be as a function that prepare an HTTP response manually
  // See https://nodejs.org/api/http.html#class-httpserverresponse
  'POST /api/processData': ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        additional: {
          body,
          query,
          headers,
          params
        },
        message: 'It is response made with ServerResponse',
      }),
    );
  },
};
```

Setup middleware for HTTP server with the path to the dummies file (this example uses Connect server, check more setup examples below)

`./server.js`:
```js
var connect = require('connect');
var http = require('http');
const { middleware: fakeApiMiddleware } = require('fake-api-middleware');
 
var app = connect();

app.use(
  fakeApiMiddleware({
    responsesFile: './apiDummies/index.ts',
    watchFiles: ['./apiDummies/*'],
    responseDelay: 250,
    enable: true,
  }),
);

http.createServer(app).listen(3000);
```


## API

Middleware options:

* `responsesFile`: (`string`) - Path for API dummies file;
* `responses`: (`Record<string, any>`) - Pre-defined dummies object (default - `{}`);
* `watchFiles`: (`string|string[]`) - Folders/files to watch for updates to reload dummies file (By default, it only watches at single `responsesFile`);
* `responseDelay`: (`number`) - Delay in ms for each dummy response (default - `0`);
* `enable`: (`boolean`) - enable/disable middleware (default - `true`);

Dummy response function options:

* `body`: (`Record<string, any>`) - Object with parsed body from request;
* `query`: (`Record<string, any>`) - Object with parsed query params of requested url;
* `headers`: (`Record<string, any>`) - Object with request headers;
* `params`: (`Record<string, any>`) - Object with URL regexp values;
* `req`: (`IncomingMessage`) - Raw Node.JS HTTP [IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) object;
* `res`: (`ServerResponse`) - Raw Node.JS HTTP [ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) object;

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
import { vitePlugin as fakeApiVitePlugin } from 'fake-api-middleware';

export default defineConfig({
  plugins: [
    fakeApiVitePlugin({
      responsesFile: './apiDummies/index.ts',
    }),
  ],
});
```

### Create React App

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
