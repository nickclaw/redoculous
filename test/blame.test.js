import parse from '../src/parse';
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

describe.only('blame', () => {

  it('should work', async () => {
    const text = `<?= (function test(){ (function(){foo})() })() ?>`;
    const ast = parse(text);
    const err = await getError(() => execute(ast, filename, module));

    blame(ast, filename, err);
  });
});
