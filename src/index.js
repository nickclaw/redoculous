import path from 'path';
import runSetup from './run-setup';
import runTemplate from './run-template';
import parse from './parse';

/**
 * Process
 * @param {Object} options
 * @param {Object} options.exports - initial exports object
 * @param {String} options.filepath - optional filepath to resolve require from
 * @param {String} options.data - the text content
 * @return {Promise<String>}
 */
export default async function process({
  exports = {},
  filepath = __dirname + __filename,
  data,
} = {}) {
  const dir = path.dirname(filepath);
  const ast = parse(data);
  const results = [];
  let module = { exports };

  for (const node of ast) {
    switch(node.type) {
      case 'script':
        module = await runSetup(node.value, module, dir);
        break;
      case 'expression':
        results.push(await runTemplate(node.value, module));
        break;
      default:
        results.push(node.value);
        break;
    }
  }

  return results.join('');
}
