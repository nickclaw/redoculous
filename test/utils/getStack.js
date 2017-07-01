
export default function getStack() {
  return new Error().stack
    .split('\n')
    .slice(2)
    .join('\n');
}
