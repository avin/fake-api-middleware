import { IncomingMessage, ServerResponse } from 'node:http';
import * as querystring from 'node:querystring';
import bodyParse from 'co-body';
import { ResponsesLoader } from './responsesLoader';
import { match } from 'path-to-regexp';

export interface MiddlewareOptions {
  responses?: Record<
    string,
    | object
    | string
    | number
    | boolean
    | null
    | ((p: ResponseFunctionParams) => any)
  >;
  responsesFile?: string;
  watchFiles?: string[];
  responseDelay?: number;
}

export interface ResponseFunctionParams {
  body: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
  params: Record<string, any>;
  req: IncomingMessage;
  res: ServerResponse;
}

export const middleware = (middlewareOptions: MiddlewareOptions) => {
  let responses = { ...middlewareOptions.responses };

  if (middlewareOptions.responsesFile) {
    const responsesConfigLoader = new ResponsesLoader({
      responsesFile: middlewareOptions.responsesFile,
      watchFiles: middlewareOptions.watchFiles,
    });
    let wasErrorLastTime = false;
    responsesConfigLoader.on('update', (newResponses) => {
      responses = newResponses;
      if (wasErrorLastTime) {
        console.info('[FakeResponses]', 'Responses successfully loaded');
      }
    });
    responsesConfigLoader.on('error', (err) => {
      console.error('[FakeResponses]', err);
      wasErrorLastTime = true;
    });
  }

  return async (req, res, next) => {
    for (const [key, response] of Object.entries(responses)) {
      const [method, apiPath] = key.split(' ');

      const [url, queryStr] = req.url.split('?');

      const matchResult = match(apiPath, { decode: decodeURIComponent })(url);

      if (matchResult && req.method === method) {
        if (middlewareOptions.responseDelay) {
          await new Promise((r) =>
            setTimeout(r, middlewareOptions.responseDelay),
          );
        }

        let body = {};
        try {
          body = await bodyParse(req);
        } catch {}

        if (typeof response === 'function') {
          const responseResult = await response({
            body,
            query: querystring.parse(queryStr),
            headers: req.headers,
            params: matchResult.params,
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
  };
};
