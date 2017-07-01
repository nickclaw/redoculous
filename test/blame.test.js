import parse from '../src/parse';
import build from '../src/build';
import execute from '../src/execute';
import blame from '../src/blame';
import { stripIndent } from 'common-tags';
import getStack from './utils/getStack';
import getError from './utils/getError';

const filename = '/path/to/foo.md';
const module = { exports: { foo: 'test' } };

describe('blame', () => {

  it('should work with an expression', async () => {
    const text = `<?= (function test(){ (function(){foo})() })() ?>`;

    const ast = parse(text);
    const code = build(ast);
    const err = await getError(execute, code, filename, module);
    const newErr = await getError(blame, code, filename, err);

    expect(newErr.stack).to.contain('/path/to/foo.md:1');
  });

  it('should work with a code block', async () => {
    const text = stripIndent`
      <?doc
        const a = 1;
        c.map(() => {});
      ?>
    `;

    const ast = parse(text);
    const code = build(ast);
    const err = await getError(execute, code, filename, module);
    const newErr = await getError(blame, code, filename, err);

    expect(newErr.stack).to.contain('/path/to/foo.md:3');
  });

  it('should work with nested functions', async () => {
    const text = stripIndent`
      <?doc
        const willThrow = () => { foo };
        const willCall = () => willThrow();
      ?>

      some random text

      <?= willCall() ?>
    `;

    const ast = parse(text);
    const code = build(ast);
    const err = await getError(execute, code, filename, module);
    const newErr = await getError(blame, code, filename, err);


    const expected = stripIndent`
      ReferenceError: foo is not defined
          at willThrow (/path/to/foo.md:2)
          at willCall (/path/to/foo.md:3)
          at /path/to/foo.md:8
      From call:`; // ...

    expect(newErr.stack).to.include(expected);
  });
});
