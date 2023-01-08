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
