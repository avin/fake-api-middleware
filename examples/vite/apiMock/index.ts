import { delay } from '../../../dist/index.mjs';

export default {
  'POST /fake-api/test-simple': {
    success: true,
    resultData: 'It is simple response defined as object!!!',
  },
  'POST /fake-api/test-simple-func': async ({
    body,
    query,
    headers,
    params,
    req,
    res,
  }) => {
    await delay(250);
    return {
      success: true,
      additional: {
        body,
        query,
        headers,
        params,
      },
      resultData: 'It is response made as simple return',
    };
  },
  'POST /fake-api/test-raw-func': ({
    body,
    query,
    headers,
    params,
    req,
    res,
  }) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(
      JSON.stringify({
        success: true,
        additional: {
          body,
          query,
          headers,
          params,
        },
        resultData: 'It is response made with ServerResponse',
      }),
    );
  },
  'GET /fake-api/params/:id': async ({
    body,
    query,
    headers,
    params,
    req,
    res,
  }) => {
    await delay(250);
    return {
      success: true,
      additional: {
        body,
        query,
        headers,
        params,
      },
      resultData: 'This url includes regexp',
    };
  },
};
