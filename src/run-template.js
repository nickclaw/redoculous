import vm from 'vm';
import Promise from 'bluebird';
import { stripIndent } from 'common-tags';

export default (
  text = '',
  _module = { exports: {} }
) => {
  const code = stripIndent`
    const __fn__ = async () => {
      const val = await ${text};
      // TODO call thunks?
      return val;
    }

    Promise.resolve(__fn__());
  `;

  // shallow clone
  const module = { ..._module, exports: {
    ..._module.exports
  }};

  const ctx = {
    Promise,
    ...module,
    ...module.exports,
  };

  return vm.runInContext(
    code,
    vm.createContext(ctx)
  );
}
