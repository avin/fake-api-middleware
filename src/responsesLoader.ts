import { EventEmitter } from 'node:events';
import * as chokidar from 'chokidar';
import debounce from 'lodash/debounce';
import { extendedRequire } from './utils/module';

export class ResponsesLoader extends EventEmitter {
  protected responsesFile: string;
  protected watchFiles: string[];
  constructor({
    responsesFile,
    watchFiles,
  }: {
    responsesFile: string;
    watchFiles: string[] | undefined;
  }) {
    super();

    this.responsesFile = responsesFile;
    this.watchFiles = watchFiles || [];

    chokidar.watch([this.responsesFile, ...this.watchFiles]).on(
      'all',
      debounce(async (event, path) => {
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
