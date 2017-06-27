import assert from 'assert';

export default function parse(str) {
  const ast = [];
  let at = 0;
  let ch = str[at];

  const skip = (n) => {
    at += n;
    ch = str[at];
    return ch;
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
    let data = "";
    while (ch && !peek('<?doc') && !peek('<?=')) {
      data += ch;
      skip(1);
    }

    return {
      type: 'text',
      value: data,
    };
  }

  function expression() {
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
    }
  }

  function script() {
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
