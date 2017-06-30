# redoculous [![Build Status](https://travis-ci.org/nickclaw/redoculous.svg?branch=master)](https://travis-ci.org/nickclaw/redoculous)

An async template library in the style of PHP. [Try it out!](https://npm.runkit.com/redoculous)
 - Use the entire power of the node runtime.
 - Handle asynchronous code easily with `await`
 - Identify errors fast with [accurate stack traces](/test/blame.test.js).

### Example

```js
import render from 'redoculous';
import fs from 'fs';

const path = '/path/to/template.md.doc';
const raw = fs.readFileSync(path);

render({
  filepath: path,
  data: raw,
}).then(
  text => console.log(text),
  err => console.error(err),
);
```

### API

##### `render(options: Object) -> Promise<String>`
Process a template into text. Takes the following options:
 - `data: String` the template to render
 - `filepath: ?String` where to resolve `require` from
 - `exports: ?Object` the `exports` object your template can use

### Syntax

```php
<?doc
// you have a full node environment to play around in
const foo = "World";
const bar = require("./module");
?>

# Interpolate exported values easily with: <?= foo ?>


<?doc
// all code is run inside an async function
const result = await new Promise(res => setTimeout(
  res,
  500,
  "value"
));
?>

The result is <?= result ?>


<?doc
// you can also interpolate code and text
for (let i = 0; i < 10; i++) { ?>
repeating <?= i ?> times
<?doc } ?>

```
