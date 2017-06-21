import redoculous from '../src';
import { stripIndent } from 'common-tags';
import _ from 'lodash';
import fs from 'fs';
import stringify from 'remark-stringify';
import remark from 'remark';
import Promise from 'bluebird';

function prettyPrint(text) {
process.stdout.write(
`
########################################
${text}
########################################
`
);
}

describe('redoculous', () => {

  require('./run-setup.test.js');
  require('./run-template.test.js');

  describe('plugin', () => {

    const process = (text) => Promise.fromNode(done =>
      remark()
        .use(redoculous)
        .use(stringify)
        .process(text, done)
    );

    it('should work', () => {
      const text = fs.readFileSync(__dirname + '/fixtures/example.md').toString('utf8');

      return process(text)
        .tap(file => prettyPrint(String(file)));
    });
  });
})
