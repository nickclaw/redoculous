import visit from 'unist-util-visit';
import Promise from 'bluebird';
import runSetup from './run-setup';
import runTemplate from './run-template';

Promise.config({ cancellation: true });

function isSetup(node) {
  return node.type === 'code'
    && node.lang === 'setup';
}

function isTemplate(node) {
  return typeof node.value === 'string'
    && !!node.value.match(/\{\{.+?\}\}/);
}

function createVisitor(queue) {

  return function visitor(node, index, parent) {
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

function createModifier(module) {

  async function executeSetup({ node, parent }) {
    module = await runSetup(node.value, module);
    parent.children.splice(parent.children.indexOf(node), 1);
  }

  async function executeTemplate({ node }) {
    const raws = node.value.match(/\{\{(.+?)\}\}/g).map(s => s.substring(2, s.length - 2));
    const values = await Promise.all(raws.map(raw => runTemplate(raw, module)));
    const text = node.value.replace(/\{\{(.+?)\}\}/g, () => values.shift());
    node.value = text;
  }

  return (step) => {
    switch (step.type) {
      case 'setup': return executeSetup(step);
      case 'template': return executeTemplate(step);
    }
  }
}

export default function attacher() {

  return async function transformer(node) {
    const queue = [];
    const module = { exports: {} };
    const visitor = createVisitor(queue);
    const modifier = createModifier(module);

    visit(node, visitor);

    return Promise
      .resolve(queue)
      .each(modifier)
      .return(node);
  }
}
