require('babel-register');

module.exports = Promise.resolve()
  .then(require('./suites/parse').default)
  .then(require('./suites/build').default)
  .then(require('./suites/execute').default)
  .then(require('./suites/render').default)
  .catch(e => console.log(e))
  .then(() => console.log('done'));
