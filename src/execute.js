import { runInContext, createContext } from 'vm';
import { stripIndent } from 'common-tags';
import importFrom from 'import-from';
import Promise from 'bluebird';

function safe(val) {
  return JSON.stringify(val);
}

function createScriptBlock(node) {
  return `;${node.value};`
}

function createExpressionBlock(node) {
  return `;$print(await ${safe(node.value)});`;
}

function createTextBlock(node) {
  return `;$print(${safe(node.value)});`
}

export default function execute(ast, module, dir) {
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
    require: id => importFrom(dir, id),
    module: module,
    exports: module.exports,
  });

  return Promise.resolve(runInContext(code, ctx));
}
