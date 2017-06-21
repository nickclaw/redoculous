import Promise from 'bluebird';
import { runInContext, createContext } from 'vm';
import { stripIndent } from 'common-tags';

export default (
  text = '',
  _module = { exports: {} }
) => {

  // shallow clone module
  const module = { ..._module, exports: {
    ..._module.exports
  }};

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


  const ctx = createContext({
    ...module.exports,
    $require: require,
  });

  return Promise.resolve(runInContext(code, ctx));
}
