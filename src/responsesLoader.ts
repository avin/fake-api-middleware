import { EventEmitter } from 'node:events';
import * as chokidar from 'chokidar';
import debounce from 'lodash/debounce';
import { extendedRequire } from './utils/module';
import isString from 'lodash/isString';

export class ResponsesLoader extends EventEmitter {
  protected responsesFile: string;
  protected watchFiles: string[];
  constructor({
    responsesFile,
    watchFiles,
  }: {
    responsesFile: string;
    watchFiles: string | string[] | undefined;
  }) {
    super();

    this.responsesFile = responsesFile;

    if (isString(watchFiles)) {
      watchFiles = [watchFiles as string];
    }
    this.watchFiles = (watchFiles as string[] | undefined) || [];

    chokidar.watch([this.responsesFile, ...this.watchFiles]).on(
      'all',
      debounce(async () => {
        try {
          const responsesConfig = await extendedRequire(this.responsesFile);
          this.emit('update', responsesConfig);
        } catch (e) {
          this.emit('error', e);
        }
      }, 300),
    );
  }
}
