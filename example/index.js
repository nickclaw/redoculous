const render = require('redoculous').default;
const { stripIndent } = require('common-tags');
require('superagent'); // for runkit

const template = stripIndent`
  <?doc
    // setup variables inside code blocks
    const world = "World";
  ?>
  # Hello <?= world ?>!

  <?doc
    // you can await things in your template too
    const superagent = require('superagent');
    const result = await superagent
      .get('https://www.metaweather.com/api/location/search')
      .query({ query: 'seat' });
  ?>
  > <?= result.body[0].title.toUpperCase() ?>
`;

render({
  data: template,
  filepath: '/path/to/foo.md',
}).then(
  val => console.log(val),
  err => console.log(err.stack),
);
