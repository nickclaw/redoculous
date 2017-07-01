import fs from 'fs';
import path from 'path';

import render from '../src';

describe('redoculous', () => {
  require('./parse.test.js');
  require('./build.test.js');
  require('./execute.test.js');
  require('./blame.test.js');

  describe('integration tests', () => {
    const folder = path.join(__dirname, 'integration');

    fs.readdirSync(folder).forEach(dir => {
      it(`it should render ${dir} correctly`, async () => {
        const inputPath = path.join(folder, dir, 'input');
        const outputPath = path.join(folder, dir, 'output');
        const input = fs.readFileSync(inputPath).toString('utf8');
        const expected = fs.readFileSync(outputPath).toString('utf8');

        let output = null;

        try {
          output = await render({
            filepath: inputPath,
            template: input,
          });
        } catch (err) {
          output = err.stack;
        } finally {
          expect(output).to.equal(expected);
        }
      });
    })
  });
});
