import execute from '../src/execute';
import { stripIndent } from 'common-tags';
import path from 'path';

describe('execute', () => {

  it('should return a promise', () => {
    return execute('1', '/foo.js', {})
      .then(val => expect(val).to.equal(1));
  });

  it('should not synchronously throw when invoking', () => {
    return execute('foo', '/foo.js', {})
      .catch(e => expect(e.message).to.match(/foo/));
  });

  it('should set the proper __dirname & __filename', () => {
    const code = stripIndent`
      (() => {
        expect(__filename).to.equal('foo.js');
        expect(__dirname).to.equal('/path/to');
      })()
    `;

    return execute(code, '/path/to/foo.js', {});
  });

  it('should provide an empty module.exports', () => {
    const code = stripIndent`
      (() => {
        expect(exports).to.exist;
        expect(module).to.exist;
        expect(exports).to.equal(module.exports);
      })();
    `;

    return execute(code, '/path/to/foo.js', {});
  });

  it('should be able to require relative to the filepath', () => {
    const filepath = path.join(__dirname, 'integration', 'readme-example', 'input');
    const code = stripIndent`
      (() => {
        const val = require('./module');
        expect(val).to.equal('foo');
      })();
    `;

    return execute(code, filepath, {});
  });

  it('should have access to all the global you expect', () => {
    const code = stripIndent`
      (() => {
        expect(global).to.exist;
        expect(process).to.exist;
        expect(setTimeout).to.exist;
        expect(Buffer).to.exist;
        expect(Promise).to.exist;
        // etc..
      })();
    `;

    return execute(code, '/path/to/foo.js', {});
  });

  it('should be possible to set or override globals', () => {
    const code = stripIndent`
      (() => {
        expect(bar).to.exist;
        expect(process).to.equal('foo');
      })();
    `;

    return execute(code, '/path/to/foo.js', {
      process: 'foo',
      bar: 'baz',
    });
  });

  it('should not be possible to override "module arguments"', () => {
    const code = stripIndent`
      (() => {
        expect(__dirname).to.equal('/path/to');
        expect(require).to.be.a('function');
      })();
    `;

    return execute(code, '/path/to/foo.js', {
      __dirname: 'foo',
      require: 'baz',
    });
  });
});
