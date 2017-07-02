import { Suite } from 'benchmark';
import fs from 'fs';
import path from 'path';
import oldRender from '../../lib';
import newRender from '../../src';

const filepath = path.join(__dirname, '..', 'fixtures', 'template');
const template = fs.readFileSync(filepath).toString('utf8');
const options = { filepath, template };

export default () => new Promise(res => {
  const suite = new Suite();

  suite.add('old version', {
    defer: true,
    fn: def => oldRender(options)
      .then(() => def.resolve())
      .catch(e => def.resolve()),
  });

  suite.add('new version', {
    defer: true,
    fn: def => newRender(options)
      .then(() => def.resolve())
      .catch(e => def.resolve()),
  });

  suite.on('cycle', (evt) => {
    console.log(String(evt.target));
  });

  suite.on('complete', () => {
    console.log('Fastest renderer is ' + suite.filter('fastest').map('name'));
    res();
  });

  suite.run();
});
