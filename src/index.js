import parse from './parse';
import build from './build';
import execute from './execute';
import blame from './blame';

/**
 * Render
 * @param {Object} options
 * @param {String} options.template - the text content
 * @param {String} options.filepath - optional filepath to resolve require from
 * @param {Object=} options.globals - initial globals object
 * @return {Promise<String>}
 */
export default function render({
  template,
  filepath,
  globals = {},
} = {}) {
  const ast = parse(template);
  const code = build(ast);

  return execute(code, filepath, globals)
    .catch(err => blame(code, filepath, err));
}
