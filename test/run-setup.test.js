import runSetup from '../src/run-setup';
import { stripIndent } from 'common-tags';
import _ from 'lodash';

describe('runSetup', () => {

  it('should work', () => {
    const raw = stripIndent`
      1 + 1;
    `;

    return runSetup(raw);
  });

  it('should resolve with the exports', () => {
    const raw = stripIndent`
      exports.foo = "bar";
    `;

    return runSetup(raw)
      .tap(m => expect(m.exports).to.deep.equal({ foo: 'bar' }));
  });

  it('should support overriding exports', () => {
    const raw = stripIndent`
      module.exports = { foo: "bar" };
    `;

    return runSetup(raw)
      .tap(m => expect(m.exports).to.deep.equal({ foo: 'bar' }));
  });

  it('should support require', () => {
    const raw = stripIndent`
      exports.lodash = require('lodash');
    `;

    return runSetup(raw)
      .tap(m => expect(m.exports.lodash).to.equal(_));
  });

  it('should support overriding existing exports', () => {
    const module = { exports: { foo: 1 } };
    const raw = stripIndent`
      exports.bar = exports.foo + 1;
    `;

    return runSetup(raw, module)
      .tap(m => expect(m).to.not.equal(module))
      .tap(m => expect(m.exports).to.deep.equal({
        foo: 1,
        bar: 2,
      }));
  });
});
