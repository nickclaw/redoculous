import assert from 'assert';

/**
 * Parse text into a redoculous AST
 * @param {String} template
 * @return {Object} ast
 */
export default function parse(str) {
  let row = 0;
  let col = 0;
  let at = 0;
  let ch = str[at];

  // return the current position
  function captureLoc() {
    return { col, row };
  }

  // move forward n characters - tracking position as well
  function skip(n) {
    for (let i = 0; i < n; i++) {
      if (ch === '\n') {
        col = 0;
        row += 1;
      } else {
        col += 1;
      }

      at += 1;
      ch = str[at];
    }
  }

  // look ahead n characters
  function peek(pat) {
    for (let i = 0; i < pat.length; i++) {
      if (pat[i] !== str[at + i]) return false;
    }

    return true;
  }

  // attempt to match a pattern
  // return true & advance if there's a match
  function match(pat) {
    if (!peek(pat)) return false;
    skip(pat.length);
    return true;
  }

  // a block like <?=.*?>
  function expression() {
    const start = captureLoc();

    assert(match('<?='), 'Expected expression tag');

    let data = "";
    while (ch && !peek('?>')) {
      data += ch;
      skip(1);
    }

    skip(2);

    return {
      type: 'expression',
      value: data,
      start: start,
      end: captureLoc(),
    }
  }

  // a block like <?doc.*?>
  function block() {
    const start = captureLoc();

    assert(match('<?doc'), 'Expected doc tag');

    let data = "";
    while (ch && !peek('?>')) {
      data += ch;
      skip(1);
    }

    skip(2);

    return {
      type: 'block',
      value: data,
      start: start,
      end: captureLoc(),
    };
  }

  // literally anything else
  function text() {
    const start = captureLoc();
    let data = "";

    while (ch && !peek('<?doc') && !peek('<?=')) {
      data += ch;
      skip(1);
    }

    return {
      type: 'text',
      value: data,
      start: start,
      end: captureLoc(),
    };
  }

  // an expression, block, or text
  function value() {
    if (peek('<?=')) return expression();
    if (peek('<?doc')) return block();
    return text();
  }

  // a redoc template
  function redoc() {
    const start = captureLoc();
    const children = [];

    while(ch) {
      children.push(value());
    }

    const end = captureLoc();

    return {
      type: 'redoc',
      children,
      start,
      end,
    };
  }

  return redoc();
}
