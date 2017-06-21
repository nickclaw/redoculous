import runTemplate from '../src/run-template';
import { stripIndent } from 'common-tags';
import _ from 'lodash';

describe('runTemplate', () => {

  it('should execute an expression', () => {
    const raw = stripIndent`
      1 + 1;
    `;

    return runTemplate(raw)
      .tap(val => expect(val).to.equal(2));
  });

  it('should resolve promises', () => {
    const raw = stripIndent`
      new Promise(res => res(1 + 1));
    `;

    return runTemplate(raw)
      .tap(val => expect(val).to.equal(2));
  });

  it('should be able to access exports in global scope', () => {
    const module = { exports: { foo: 2 } }
    const raw = stripIndent`
      foo
    `;

    return runTemplate(raw, module)
      .tap(val => expect(val).to.equal(2));
  });
});
