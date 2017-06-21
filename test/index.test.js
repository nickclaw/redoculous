import Promise from 'bluebird';
import fs from 'fs';
import _ from 'lodash';
import remark from 'remark';
import stringify from 'remark-stringify';

import redoculous from '../src';
import print from './utils/print';

describe('redoculous', () => {

  require('./run-setup.test.js');
  require('./run-template.test.js');

  describe('plugin', () => {

    it('should be possible to define initial exports', () => {
      return remark()
        .use(redoculous, { exports: { foo: 1 } })
        .use(stringify)
        .process(`{{foo}}`)
        .then(file => String(file))
        .then(text => expect(text).to.equal('1\n'));
    });

    it('should run the example', () => {
      const path = __dirname + '/fixtures/example.md';
      const text = fs.readFileSync(path).toString('utf8');

      return remark()
        .use(redoculous)
        .use(stringify)
        .process(text)
        .then(file => String(file))
        .then(result => print(text, result));
    });
  });
})
