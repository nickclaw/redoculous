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
    const $fn = async () => { ${text}; };
    Promise.resolve($fn()).then(() => module);
  `;

  const ctx = createContext({
    ...global,
    require: require,
    module: module,
    exports: module.exports,
  });

  return Promise.resolve(runInContext(code, ctx));
}
