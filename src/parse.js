
/**
 * Parse text into a redoculous AST
 * @param {String} template
 * @return {Object} ast
 */
export default function parse(str) {
  var row = 0;
  var col = 0;
  var at = 0;
  var ch = str[at];

  // return the current position
  function captureLoc() {
    return { col, row };
  }

  // move forward n characters - tracking position as well
  function skip(n) {
    for (var i = 0; i < n; i++) {
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
    for (var i = 0; i < pat.length; i++) {
      if (pat[i] !== str[at + i]) return false;
    }

    return true;
  }

  // a block like <?=.*?>
  function expression() {
    var start = captureLoc();
    skip(3);

    var data = "";
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
    var start = captureLoc();
    skip(5);

    var data = "";
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
    var start = captureLoc();
    var data = "";

    while (ch && !peek('<?=') && !peek('<?doc')) {
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
    var start = captureLoc();
    var children = [];

    while(ch) {
      children.push(value());
    }

    var end = captureLoc();

    return {
      type: 'redoc',
      children,
      start,
      end,
    };
  }

  return redoc();
}
