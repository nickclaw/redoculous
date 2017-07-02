import { Suite } from 'benchmark';
import fs from 'fs';
import path from 'path';
import oldParse from '../../lib/parse';
import newParse from '../../src/parse';
import oldBuild from '../../lib/parse';
import newBuild from '../../src/parse';

const filepath = path.join(__dirname, '..', 'fixtures', 'template');
const template = fs.readFileSync(filepath).toString('utf8');

const oldAst = oldParse(template);
const newAst = newParse(template);

export default () => new Promise((res) => {
  const suite = new Suite();

  suite.add('old version', {
    fn: () => oldBuild(oldAst),
  });

  suite.add('new version', {
    fn: () => newBuild(newAst),
  });

  suite.on('cycle', (evt) => {
    console.log(String(evt.target));
  });

  suite.on('complete', () => {
    console.log('Fastest builder is ' + suite.filter('fastest').map('name'));
    res();
  });

  suite.run();
});
