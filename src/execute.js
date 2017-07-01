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
  const __dirname = path.dirname(filepath);
  const __filename = path.basename(filepath);
  const require = id => importFrom(__dirname, id);
  const exports = {};
  const module = { exports };
  // TODO maybe include all from https://nodejs.org/api/modules.html

  const ctx = createContext({
    ...global,
    ...globals,
    __dirname,
    __filename,
    require,
    module,
    exports,
  });

  const options = {
    filename: filepath,
    lineOffset: -1,
  };

  return Promise.resolve(runInContext(code, ctx, options));
}
