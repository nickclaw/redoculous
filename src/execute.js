import { runInContext, createContext } from 'vm';
import importFrom from 'import-from';
import path from 'path';

/**
 * Execute code built by the build function
 * @param {String} code
 * @param {String} filepath
 * @param {Object} globals
 * @return {Promise<String>}
 */
export default function execute(code, filepath, globals) {
  // TODO maybe include all from https://nodejs.org/api/modules.html
  const module = { exports: {} };
  const dir = path.dirname(filepath);

  const ctx = createContext({
    ...global,
    ...globals,
    module: module,
    exports: module.exports,
    __dirname: dir,
    __filename: path.basename(filepath),
    require: id => importFrom(dir, id),
  });

  const options = {
    filename: filepath,
    lineOffset: -1,
  };

  return new Promise((res, rej) => {
    try {
      res(runInContext(code, ctx, options));
    } catch (e) {
      rej(e);
    }
  });
}
