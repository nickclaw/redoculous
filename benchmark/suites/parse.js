import { Suite } from 'benchmark';
import fs from 'fs';
import path from 'path';
import oldParse from '../../lib/parse';
import newParse from '../../src/parse';

const filepath = path.join(__dirname, '..', 'fixtures', 'template');
const template = fs.readFileSync(filepath).toString('utf8');

export default () => new Promise(res => {
  const suite = new Suite();

  suite.add('old version', {
    fn: () => oldParse(template),
  });

  suite.add('new version', {
    fn: () => newParse(template),
  });

  suite.on('cycle', (evt) => {
    console.log(String(evt.target));
  });

  suite.on('complete', () => {
    console.log('Fastest parser is ' + suite.filter('fastest').map('name'));
    res();
  });

  suite.run();
});
