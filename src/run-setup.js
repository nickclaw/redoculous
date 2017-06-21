import Promise from 'bluebird';
import { runInContext, createContext } from 'vm';
import { stripIndent } from 'common-tags';
import importFrom from 'import-from';

export default (
  text = '',
  _module = { exports: {} },
  dir = __dirname + __filename,
) => {

  // shallow clone module
  const module = { ..._module, exports: {
    ..._module.exports
  }};

  const code = stripIndent`
    const $fn = async () => { ${text}; };
    Promise.resolve($fn()).then(() => module);
  `;

  // TODO try to supply everything node does, but with the the filename/dirname of the md file
  // https://stackoverflow.com/q/35211056/2993423
  const ctx = createContext({
    ...global,
    require: id => importFrom(dir, id),
    module: module,
    exports: module.exports,
  });

  return Promise.resolve(runInContext(code, ctx));
}
