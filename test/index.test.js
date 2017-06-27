import fs from 'fs';
import _ from 'lodash';

import redoculous from '../src';
import print from './utils/print';

describe('redoculous', () => {

  require('./run-setup.test.js');
  require('./run-template.test.js');
  require('./parse.test.js');

  describe('process', () => {
    it('should work', async () => {
      const path = __dirname + '/fixtures/example.md.doc';
      const raw = fs.readFileSync(path).toString('utf8');
      const text = await redoculous({
        filepath: path,
        data: raw,
      });

      print(raw, text);
    });
  });
});
