import * as path from 'node:path';
import * as fs from 'node:fs';
import * as module from 'node:module';
import { build as esbuildBuild } from 'esbuild';

const _require = module.createRequire(process.cwd());

interface NodeModuleWithCompile extends NodeModule {
  _compile(code: string, filename: string): any;
}

export const executeModule = (filePath: string, bundledCode: string) => {
  filePath = path.resolve(process.cwd(), filePath);
  const extension = path.extname(filePath);

  // @ts-expect-error
  const extensions = module.Module._extensions;
  const defaultLoader = extensions[extension]!;

  extensions[extension] = (module: NodeModule, filename: string) => {
    if (filename === filePath) {
      (module as NodeModuleWithCompile)._compile(bundledCode, filename);
    } else {
      defaultLoader(module, filename);
    }
  };

  if (_require && _require.cache) {
    delete _require.cache[filePath];
  }
  const raw = _require(filePath);
  const config = raw.__esModule ? raw.default : raw;
  if (defaultLoader) {
    extensions[extension] = defaultLoader;
  }

  return config;
};

export const extendedRequire = async <T>(filePath: string): Promise<T> => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'),
  );

  const srcCode = await (async () => {
    const result = await esbuildBuild({
      entryPoints: [filePath],
      outfile: 'out.js',
      write: false,
      platform: 'node',
      bundle: true,
      format: 'cjs',
      metafile: true,
      target: 'es2015',
      external: [
        'esbuild',
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ],
      logLevel: 'silent',
    });
    const { text } = result.outputFiles[0];

    return text;
  })();

  return (await executeModule(filePath, srcCode)) as T;
};
