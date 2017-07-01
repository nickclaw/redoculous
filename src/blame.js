
/**
 * Rewrite stack traces to make them match the template
 * @param {String} code
 * @param {String} filepath
 * @param {Error} err
 * @throw {Error}
 */
export default function blame(code, filepath, err) {
  const codeLines = code.split('\n');
  const stack = err.stack.split('\n');

  // extract important pieces from the stak
  const startIndex = stack.findIndex(line => line.match(/^\s+at/));
  const stopIndex = stack.findIndex(line => line.match(/^\s+at \$fn/)) + 1;
  const message = stack.slice(0, startIndex);
  const rawLines = stack.slice(startIndex, stopIndex);

  // transform lines
  const lines = rawLines.map(line => {
    // is this line remappable?
    const regex = new RegExp(`${filepath}:(\\d+):(\\d+)`);
    const match = line.match(regex);
    if (!match) return line;

    const [all, row] = match;
    const [_comment, fileRow] = codeLines[row].match(/\/\* (\d+) \*\//); // eslint-disable-line no-unused-vars
    const displayRow = parseInt(fileRow, 10) + 1;

    return line.replace(all, `${filepath}:${displayRow}`);
  });

  // update the original error's stack
  err.stack = [...message, ...lines].join('\n');

  throw err;
}
