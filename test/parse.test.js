import parse from '../src/parse';
import { stripIndent } from 'common-tags';

describe('parse', () => {

  it('should parse plain text', () => {
    const str = stripIndent`
      foo
      bar
    `;

    const [node] = parse(str);
    expect(node.value).to.equal('foo\nbar');
    expect(node.start).to.deep.equal({ row: 0, col: 0 });
    expect(node.end).to.deep.equal({ row: 1, col: 3 });
  });

  it('should be able to parse an expression', () => {
    const str = stripIndent`
      <?= foo ?>
    `;

    const [node] = parse(str);
    expect(node.value).to.equal(' foo ');
    expect(node.start).to.deep.equal({ row: 0, col: 0 });
    expect(node.end).to.deep.equal({ row: 0, col: 10 });
  });

  it('should be able to parse a block', () => {
    const str = stripIndent`
      <?doc
        const foo = 'bar';
      ?>
    `

    const [node] = parse(str);
    expect(node.value).to.equal(`\n  const foo = 'bar';\n`);
    expect(node.start).to.deep.equal({ row: 0, col: 0 });
    expect(node.end).to.deep.equal({ row: 2, col: 2 });
  });

  it('should work', () => {
    const str = stripIndent`
      # hello world
      <?doc
        console.log("foo");
      ?>

      this is the best thing in the <?= world ?> isn't it?
    `;

    const ast = parse(str);
  });
});
