# redoculous [![Build Status](https://travis-ci.org/nickclaw/redoculous.svg?branch=master)](https://travis-ci.org/nickclaw/redoculous)

### Example

```js
import remark from 'remark';
import stringify from 'remark-stringify';
import redoculous from 'redoculous';

remark()
  .use(redoculous)
  .use(stringify)
  .process(someMarkdown, (err, file) => {
    console.log(String(file));
  });
```
