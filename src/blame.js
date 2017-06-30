
export default function blame(ast, filepath, err) {
  const stack = err.stack.split('\n');
  const startIndex = stack.findIndex(line => line.match(/^\s+at/));
  const stopIndex = stack.findIndex(line => line.match(/^\s+at \$fn/)) + 1;
  const message = stack.slice(0, startIndex);
  const lines = stack.slice(startIndex, stopIndex);

  err.stack = [...message, ...lines].join('\n');

  throw err;
}
