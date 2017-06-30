import { runInContext, createContext } from 'vm';
import importFrom from 'import-from';
import Promise from 'bluebird';
import path from 'path';

export default function execute(code, filepath, module) {
  const __dirname = path.dirname(filepath);
  const __filename = path.basename(filepath);
  const require = id => importFrom(__dirname, id);

  const ctx = createContext({
    ...global,
    __dirname,
    __filename,
    module,
    require,
    exports: module.exports,
  });

  const options = {
    filename: filepath,
    lineOffset: -1,
  };

  return Promise.resolve(runInContext(code, ctx, options));
}
