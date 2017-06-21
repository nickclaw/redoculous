import vm from 'vm';
import Promise from 'bluebird';
import { stripIndent } from 'common-tags';

export default (
  text = '',
  _module = { exports: {} }
) => {
  const code = stripIndent`
    const $fn = async () => { ${text}; };
    Promise.resolve($fn()).return(module);
  `;

  // shallow clone
  const module = { ..._module, exports: {
    ..._module.exports
  }};

  const ctx = {
    ...global,
    Promise: Promise,
    require: require,
    module: module,
    exports: module.exports,
  };

  return vm.runInContext(
    code,
    vm.createContext(ctx)
  );
}
