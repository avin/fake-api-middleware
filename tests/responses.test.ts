import connect from 'connect';
import { describe, it, beforeEach, expect } from 'vitest';
import { middleware, delay } from '../src';
import request from 'supertest';

describe('read responses from files', () => {
  let app;

  beforeEach(() => {
    app = connect();
  });

  it('read responses from JS file', async () => {
    app.use(
      middleware({
        responsesFile: './tests/responses-js/index.js',
      }),
    );

    await delay(300);

    const response = await request(app).get('/test');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      foo: 'bar',
    });
  });

  it('read responses from TS file', async () => {
    app.use(
      middleware({
        responsesFile: './tests/responses-ts/index.ts',
      }),
    );

    await delay(300);

    const response = await request(app).get('/test');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      foo: 'bar',
    });
  });
});
