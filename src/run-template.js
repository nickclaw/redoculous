import vm from 'vm';
import Promise from 'bluebird';
import { stripIndent } from 'common-tags';

export default (
  text = '',
  _module = { exports: {} }
) => {
  const code = stripIndent`
    const $util = $require('util');
    const $fn = async () => {
      return await ${text};
    };

    Promise.resolve($fn()).then(val => {
      // handle objects
      if (typeof val === 'object') {
        return $util.inspect(val);
      }

      // handle thunks
      if (typeof val === 'function') {
        return val();
      }

      return val;
    });
  `;

  // shallow clone
  const module = { ..._module, exports: {
    ..._module.exports
  }};

  const ctx = {
    ...module,
    ...module.exports,
    Promise: Promise,
    $require: require,
  };

  return vm.runInContext(
    code,
    vm.createContext(ctx)
  );
}
