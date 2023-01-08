import { middleware, MiddlewareOptions } from './middleware';

export const vitePlugin = (middlewareOptions: MiddlewareOptions) => {
  return {
    name: 'vite-plugin-fake-response',
    configureServer(server) {
      server.middlewares.use(middleware(middlewareOptions));
    },
  };
};
