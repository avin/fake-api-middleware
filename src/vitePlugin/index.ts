import { IncomingMessage, ServerResponse } from 'node:http';
import * as querystring from 'node:querystring';
import bodyParse from 'co-body';

export interface VitePluginOptions {
  mocksFile: string;
  watchFiles?: string[];
  responseDelay?: number;
}

export interface ResponseFunctionParams {
  body: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
  req: IncomingMessage;
  res: ServerResponse;
}

const mocks: Record<
  string,
  Record<string, any> | ((options: ResponseFunctionParams) => any)
> = {
  'POST /fake-api/test-simple': {
    success: true,
    resultData: 'It is simple response defined as object',
  },
  'POST /fake-api/test-simple-func': ({ body, query, headers, req, res }) => {
    return {
      success: true,
      additional: {
        body,
        query,
        headers,
      },
      resultData: 'It is response made as simple return',
    };
  },
  'POST /fake-api/test-raw-func': ({ body, query, headers, req, res }) => {
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
        resultData: 'It is response made with ServerResponse',
      }),
    );
  },
};

export const vitePlugin = ({ mocksFile, watchFiles }: VitePluginOptions) => {
  return {
    name: 'vite-plugin-fake-response',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        for (const [key, response] of Object.entries(mocks)) {
          const [method, apiPath] = key.split(' ');

          const [url, queryStr] = req.url.split('?');

          if (url === apiPath && req.method === method) {
            const body = await bodyParse(req);

            if (typeof response === 'function') {
              const responseResult = await response({
                body,
                query: querystring.parse(queryStr),
                headers: req.headers,
                req,
                res,
              });

              if (responseResult instanceof ServerResponse) {
                return responseResult;
              }

              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify(responseResult));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(response));
          }
        }
        return next();
      });
    },
  };
};
