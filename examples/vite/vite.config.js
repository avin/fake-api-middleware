import { defineConfig } from 'vite';
import { vitePlugin as fakeResponseVitePlugin } from '../../dist/index';

export default defineConfig({
  plugins: [
    fakeResponseVitePlugin({
      responsesFile: './apiMock/index.ts',
      watchFiles: ['./apiMock/*'],
    }),
  ],
});
