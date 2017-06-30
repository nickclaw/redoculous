import assert from 'assert';

export default function parse(str) {
  const ast = [];
  let row = 0;
  let col = 0;
  let at = 0;
  let ch = str[at];

  const captureLoc = () => {
    return { col, row };
  }

  const skip = (n) => {
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
  };

  const peek = (pat) => {
    for (let i = 0; i < pat.length; i++) {
      if (pat[i] !== str[at + i]) return false;
    }

    return true;
  };

  const match = (pat) => {
    if (!peek(pat)) return false;
    skip(pat.length);
    return true;
  };

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

  function script() {
    const start = captureLoc();

    assert(match('<?doc'), 'Expected doc tag');

    let data = "";
    while (ch && !peek('?>')) {
      data += ch;
      skip(1);
    }

    skip(2);

    return {
      type: 'script',
      value: data,
      start: start,
      end: captureLoc(),
    };
  }

  function value() {
    switch(true) {
      case peek('<?doc'): return script();
      case peek('<?='): return expression();
      case true: return text();
    }
  }

  while(ch) {
    ast.push(value());
  }

  return ast;
}
