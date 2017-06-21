# redoculous

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
