import { runInContext, createContext } from 'vm';
import { stripIndent } from 'common-tags';
import importFrom from 'import-from';
import Promise from 'bluebird';

function createScriptBlock(node) {
  return `;${node.value};`
}

function createExpressionBlock(node) {
  return `;$print($eval(${JSON.stringify(node.value)}))`;
}

function createTextBlock(node) {
  return `;$print(${JSON.stringify(node.value)});`
}

export default function execute(ast, module, dir) {
  const code = stripIndent`
    const $text = [];
    const $print = async data => $text.push(await data);
    const $eval = code => {
        const vm = require('vm');
        const ctx = vm.createContext(module.exports);
        return vm.runInContext(code, ctx);
    };

    const $fn = async () => {
      ${ast.map(node => {
        switch(node.type) {
          case 'script': return createScriptBlock(node);
          case 'expression': return createExpressionBlock(node);
          default: return createTextBlock(node);
        }
      }).join('\n')}
    }

    $fn().then(() => $text.join(''));
  `;

  const ctx = createContext({
    ...global,
    require: id => importFrom(dir, id),
    module: module,
    exports: module.exports,
  });

  return Promise.resolve(runInContext(code, ctx));
}
