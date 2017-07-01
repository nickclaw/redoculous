import _ from 'lodash';

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

  // extract important pieces from the stack
  const startIndex = stack.findIndex(line => line.match(/^\s+at/));
  const middleIndex = _.findLastIndex(stack, line => line.match(new RegExp(filepath)));
  const endIndex = stack.findIndex((line, i) => i > middleIndex && line.match(/at runInContext/)) + 1;
  const message = stack.slice(0, startIndex);
  const templateLines = stack.slice(startIndex, middleIndex);
  const finalLines = stack.slice(endIndex);

  // transform lines
  const lines = templateLines.map(line => {
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
  err.stack = [
    ...message,
    ...lines,
    "From call:",
    ...finalLines,
  ].join('\n');

  throw err;
}
