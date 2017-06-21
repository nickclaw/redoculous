# redoculous [![Build Status](https://travis-ci.org/nickclaw/redoculous.svg?branch=master)](https://travis-ci.org/nickclaw/redoculous)

### Example

```js
import remark from 'remark';
import stringify from 'remark-stringify';
import redoculous from 'redoculous';
import fs from 'fs';

const path = '/path/to/markdown.md';
const markdown = fs.readFileSync(path).toString('utf8');
const initialExports = { foo: 'bar' };  

remark()
  .use(redoculous, {
    filepath: path,
    exports: initialExports,
  })
  .use(stringify)
  .process(markdown, (err, file) => {
    console.log(String(file));
  });
```
