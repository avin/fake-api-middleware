export default {
  'POST /fake-api/test-simple': {
    success: true,
    resultData: 'It is simple response defined as object!!!',
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
