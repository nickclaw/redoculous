import { runInContext, createContext } from 'vm';
import { stripIndent } from 'common-tags';
import importFrom from 'import-from';
import Promise from 'bluebird';
import path from 'path';

function safe(val) {
  return JSON.stringify(val);
}

function createScriptBlock(node) {
  return `;${node.value};`
}

function createExpressionBlock(node) {
  return `;$print(await ${node.value});`;
}

function createTextBlock(node) {
  return `;$print(${safe(node.value)});`
}

export default function execute(ast, module, filepath) {
  const __dirname = path.dirname(filepath);
  const __filename = path.basename(filepath);
  const require = id => importFrom(__dirname, id);

  const blocks = ast.map(node => {
    switch(node.type) {
      case 'script': return createScriptBlock(node);
      case 'expression': return createExpressionBlock(node);
      default: return createTextBlock(node);
    }
  });

  const code = stripIndent`
    const $text = [];
    const $print = data => $text.push(data);

    const $fn = async () => {
      ${blocks.join('\n')};
      return $text.join('')
    }

    $fn();
  `;

  const ctx = createContext({
    ...global,
    __dirname,
    __filename,
    module,
    require,
    exports: module.exports,
  });

  return Promise.resolve(runInContext(code, ctx));
}
