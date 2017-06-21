import visit from 'unist-util-visit';
import Promise from 'bluebird';
import path from 'path';
import runSetup from './run-setup';
import runTemplate from './run-template';

/**
 * Checks if a node is a setup node
 * @param {Node} node
 * @return {Boolean}
 */
function isSetup(node) {
  return node.type === 'code'
    && node.lang === 'setup';
}

/**
 * Checks if a node is a template node
 * @param {Node} node
 * @return {Boolean}
 */
function isTemplate(node) {
  return typeof node.value === 'string'
    && !!node.value.match(/\{\{.+?\}\}/);
}


function createVisitor(queue) {

  return (node, index, parent) => {
    switch (true) {
      case isSetup(node):
        return queue.push({
          type: 'setup',
          node,
          index,
          parent,
        });

      case isTemplate(node):
        return queue.push({
          type: 'template',
          node,
          index,
          parent,
        });
    }
  }
}

function createModifier(module, dir) {

  async function executeSetup({ node, parent }) {
    module = await runSetup(node.value, module, dir);
    parent.children.splice(parent.children.indexOf(node), 1);
  }

  async function executeTemplate({ node }) {
    const raws = node.value.match(/\{\{.+?\}\}/g).map(s => s.substring(2, s.length - 2));
    const values = await Promise.all(raws.map(raw => runTemplate(raw, module)));
    const text = node.value.replace(/\{\{.+?\}\}/g, () => values.shift());
    node.value = text;
  }

  return (step) => {
    switch (step.type) {
      case 'setup': return executeSetup(step);
      case 'template': return executeTemplate(step);
    }
  }
}

/**
 * Redoculous plugin
 * @param {Object} options
 * @param {Object} options.exports - initial exports object
 * @param {String} options.filepath - optional filepath to resolve require from
 * @return {Transformer}
 */
export default function attacher({
  exports = {},
  filepath = __dirname + __filename,
} = {}) {
  const dir = path.dirname(filepath);

  return async function transformer(node) {
    const queue = [];
    const module = { exports };
    const visitor = createVisitor(queue);
    const modifier = createModifier(module, dir);

    visit(node, visitor);

    return Promise
      .resolve(queue)
      .each(modifier)
      .return(node);
  }
}
