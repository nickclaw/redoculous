import parse from '../src/parse';
import build from '../src/build';
import execute from '../src/execute';
import blame from '../src/blame';
import { stripIndent } from 'common-tags';

const filename = '/path/to/foo.md';
const module = { exports: { foo: 'test' } };

async function getError(fn) {
  try {
    await fn();
  } catch (e) {
    return e;
  }

  throw new Error('function did not throw');
}

describe('blame', () => {

  it('should work', async () => {
    const text = `<?= (function test(){ (function(){foo})() })() ?>`;
    const ast = parse(text);
    const code = build(ast);
    const err = await getError(() => execute(code, filename, module));
    const newErr = await getError(() => blame(code, filename, err));

    expect(newErr.stack).to.contain('/path/to/foo.md:1');
  });
});
