import parse from '../src/parse';
import { stripIndent } from 'common-tags';

describe('parse', () => {

  it('should work', () => {
    const str = stripIndent`
      # hello world
      <?doc
        console.log("foo");
      ?>

      this is the best thing in the <?= world ?> isn't it?
    `;

    parse(str);
  });
});
