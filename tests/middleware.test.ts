import connect from 'connect';
import { describe, it, beforeEach, expect } from 'vitest';
import { middleware } from '../src';
import request from 'supertest';

describe('general middleware', () => {
  let app;

  beforeEach(() => {
    app = connect();
  });

  it('return json with object value', async () => {
    app.use(
      middleware({
        responses: {
          'GET /test': {
            message: 'Hello',
          },
        },
      }),
    );

    const response = await request(app).get('/test');

    expect(response.headers['content-type']).toEqual('application/json');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: 'Hello',
    });
  });

  it('return json with function value', async () => {
    app.use(
      middleware({
        responses: {
          'GET /test': () => {
            return {
              message: 'Hello',
            };
          },
        },
      }),
    );

    const response = await request(app).get('/test');

    expect(response.headers['content-type']).toEqual('application/json');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      message: 'Hello',
    });
  });

  it('return json with function value and defined status code', async () => {
    app.use(
      middleware({
        responses: {
          'GET /test': ({ res }) => {
            res.statusCode = 201;
            return {
              message: 'Hello',
            };
          },
        },
      }),
    );

    const response = await request(app).get('/test');

    expect(response.headers['content-type']).toEqual('application/json');
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      message: 'Hello',
    });
  });

  it('return raw builded response', async () => {
    app.use(
      middleware({
        responses: {
          'GET /test': ({ res }) => {
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ message: 'Hello' }));
          },
        },
      }),
    );

    const response = await request(app).get('/test');

    expect(response.headers['content-type']).toEqual('application/json');
    expect(response.status).toEqual(201);
    expect(response.body).toEqual({
      message: 'Hello',
    });
  });

  it('has valid response function arguments', async () => {
    app.use(
      middleware({
        responses: {
          'POST /test/:id': ({ body, query, headers, params }) => {
            return {
              body,
              query,
              params,
              headers,
            };
          },
        },
      }),
    );

    const response = await request(app)
      .post('/test/123?foo=bar&azz=qoo')
      .send({ name: 'john' });

    expect(response.headers['content-type']).toEqual('application/json');
    expect(response.status).toEqual(200);
    expect(response.body.body).toEqual({
      name: 'john',
    });
    expect(response.body.params).toEqual({
      id: '123',
    });
    expect(response.body.query).toEqual({
      foo: 'bar',
      azz: 'qoo',
    });

    expect(response.body.headers['connection']).toEqual('close');
    expect(response.body.headers['content-length']).toEqual('15');
    expect(response.body.headers['content-type']).toEqual('application/json');
  });
});
