```setup

exports.foo = "World";
exports.bar = await Promise.resolve("bar");
```


# Hello {{foo}}

> Foo {{bar}} baz qux.

Hello {{bar}} this is {{foo}}.

```setup
const superagent = require('superagent-bluebird-promise');

exports.result = await superagent
  .get('https://www.metaweather.com/api/location/search')
  .query({ query: 'seattle' })
  .promise()
  .get('body')
  .get(0)
  .get('title');
```

The search result is {{result}}
