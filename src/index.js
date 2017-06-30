import parse from './parse';
import build from './build';
import execute from './execute';
import blame from './blame';

/**
 * Process
 * @param {Object} options
 * @param {Object} options.exports - initial exports object
 * @param {String} options.filepath - optional filepath to resolve require from
 * @param {String} options.data - the text content
 * @return {Promise<String>}
 */
export default function process({
  exports = {},
  filepath = __dirname + __filename,
  data,
} = {}) {
  const module = { exports };
  const ast = parse(data);
  const code = build(ast);

  return execute(code, filepath, module)
    .catch(err => blame(code, filepath, err));
}
