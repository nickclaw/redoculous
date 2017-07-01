import assert from 'assert';

export default async function getError(fn, ...args) {
  let val = undefined;

  try {
    val = await fn(...args);
  } catch (e) {
    return e;
  }

  assert(false, `Expected error, function returned ${val}`);
}
