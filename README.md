# Fake-Api-Middleware

This is an [Express](https://github.com/expressjs/express)+[Connect](https://github.com/senchalabs/connect) middleware for mocking API responses. It can be used with [Vite](https://github.com/vitejs/vite), [Webpack DevServer](https://github.com/webpack/webpack-dev-server), [CreateReactApp](https://github.com/facebook/create-react-app), and many other frameworks that are based on the NodeJS Connect/Express server.

- 🔩 Compatible with [Express](https://github.com/expressjs/express)+[Connect](https://github.com/senchalabs/connect)
- 🛠️ Write dummy responses with JavaScript/TypeScript
- 🔥 Hot reloading of dummy responses

## Install

```sh
npm install fake-api-middleware
```

## Usage

Create a file for storing response dummies. The file can be either in _JavaScript_ or _TypeScript_.

`./apiDummies/index.ts`: 
```ts
import { delay } from 'fake-api-middleware';
import type { ResponseFunctionParams } from 'fake-api-middleware';

export default {
  // The response can be in the form of a normal JavaScript object, which will be returned as JSON with a status code of 200
  'POST /test': {
    foo: 'bar'
  },
  
  // The response can be an object, array, string, number or null
  'GET /api/users': [
    {id: 1, name: 'Bob'},
    {id: 2, name: 'Jack'},
    {id: 3, name: 'Mike'},
  ],
  
  // The response can also be a function that returns a JavaScript object, which will be returned as a JSON response with a status code of 200
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
  
  // The API path can contain special regular expression syntax. 
  // For more information, please see https://www.npmjs.com/package/path-to-regexp
  'GET /api/users/:id': ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    return {
      message: `User with id ${params.id} is here`
    };
  },
  
  // It is possible to use asynchronous response functions
  'GET /api/async': async ({ body, query, headers, params, req, res }: ResponseFunctionParams) => {
    await delay(1000);
    return {
      message: `Hello!`
    };
  },
  
  // Alternatively, the response can be a function that manually prepares an HTTP response. 
  // For more information, please see https://nodejs.org/api/http.html#class-httpserverresponse
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

Set up the middleware for the HTTP server with the path to the file containing the response dummies. The following example demonstrates using the Connect server, but please check the setup examples below for more options.

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

Options for the middleware:

* `responsesFile`: `string` - Path for API dummies file;
* `responses`: `Record<string, any>` - Pre-defined dummies object (default - `{}`);
* `watchFiles`: `string|string[]` - Folders/files to watch for updates to reload dummies file (By default, it only watches at single `responsesFile`);
* `responseDelay`: `number` - Delay in ms for each dummy response (default - `0`);
* `enable`: `boolean` - enable/disable middleware (default - `true`);

Options for the dummy response function:

* `body`: `Record<string, any>` - Object with parsed body from request;
* `query`: `Record<string, any>` - Object with parsed query params of requested url;
* `headers`: `Record<string, any>` - Object with request headers;
* `params`: `Record<string, any>` - Object with URL regexp values;
* `req`: `IncomingMessage` - Raw Node.JS HTTP [IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage) object;
* `res`: `ServerResponse` - Raw Node.JS HTTP [ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse) object;

## Examples of how to set up the middleware

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

Use the built-in plugin for vite in the `vite.config.js` file:

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

Create `setupProxy.js` file in the `src` folder with the following content (note that the `apiDummies` folder should be in the root of the project):

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

To set up the middleware in a webpack configuration, create or modify the `devServer` section and add a `before` rule:

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
