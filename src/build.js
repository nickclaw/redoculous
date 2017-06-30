import { stripIndent } from 'common-tags';

function safe(val) {
  return JSON.stringify(val);
}

function annotate(node, str) {
  return str.split('\n').reduce(
    (acc, line, i) => `${acc}\n/* ${node.start.row + i} */ ${line}`,
    ''
  );
}

function createScriptBlock(node) {
  const line = `;${node.value};`;
  return annotate(node, line);
}

function createExpressionBlock(node) {
  const line = `;$print(await ${node.value});`;
  return annotate(node, line);
}

function createTextBlock(node) {
  const line = `;$print(${safe(node.value)});`;
  return line;
}

export default function execute(ast) {
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

  return code;
}
