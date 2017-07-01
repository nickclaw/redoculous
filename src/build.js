import { stripIndent } from 'common-tags';

function annotate(node, str) {
  return str
    .split('\n')
    .map((line, i) => `/* ${node.start.row + i} */ ${line}`)
    .join('\n');
}

function createBlock(node) {
  const line = `;${node.value};`;
  return annotate(node, line);
}

function createExpression(node) {
  const line = `;$print(await ${node.value});`;
  return annotate(node, line);
}

function createText(node) {
  const text = JSON.stringify(node.value);
  const line = `;$print(${text});`;
  return line;
}

function createLine(node) {
  switch(node.type) {
    case 'block': return createBlock(node);
    case 'expression': return createExpression(node);
    default: return createText(node);
  }
}

/**
 * Turns a template AST into js code
 * @param {Array} ast
 * @return {String} code
 */
export default function build(ast) {
  const content = ast.children
    .map(createLine)
    .join('\n');

  const code = stripIndent`
    const $text = [];
    const $print = data => $text.push(data);

    const $fn = async () => {
      ${content};
      return $text.join('')
    }

    $fn();
  `;

  return code;
}
