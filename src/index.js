import parse from './parse';
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
  const ast = parse(data);
  const module = { exports };

  return execute(ast, filepath, module)
    .catch(err => blame(ast, filepath, err));
}
