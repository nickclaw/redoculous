import { Suite } from 'benchmark';
import fs from 'fs';
import path from 'path';
import oldParse from '../../lib/parse';
import newParse from '../../src/parse';
import oldBuild from '../../lib/build';
import newBuild from '../../src/build';
import oldExecute from '../../lib/execute';
import newExecute from '../../src/execute';

const filepath = path.join(__dirname, '..', 'fixtures', 'template');
const template = fs.readFileSync(filepath).toString('utf8');

const oldAst = oldParse(template);
const newAst = newParse(template);
const oldCode = oldBuild(oldAst);
const newCode = newBuild(newAst);

export default () => new Promise((res) => {
  const suite = new Suite();

  suite.add('old version', {
    defer: true,
    fn: def => oldExecute(oldCode, filepath, {})
      .catch(e => console.log(e))
      .then(() => def.resolve()),
  });

  suite.add('new version', {
    defer: true,
    fn: def => newExecute(newCode, filepath, {})
      .catch(e => console.log(e))
      .then(() => def.resolve()),
  });

  suite.on('cycle', (evt) => {
    console.log(String(evt.target));
  });

  suite.on('complete', () => {
    console.log('Fastest executer is ' + suite.filter('fastest').map('name'));
    res();
  });

  suite.run({ async: true });
});
