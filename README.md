# redoculous [![Build Status](https://travis-ci.org/nickclaw/redoculous.svg?branch=master)](https://travis-ci.org/nickclaw/redoculous)

### Example

```js
import process from 'redoculous';
import fs from 'fs';

const path = '/path/to/template.md.doc';
const raw = fs.readFileSync(path);

process({
  filepath: path,
  data: raw,
}).then(
  text => console.log(text),
  err => console.error(err),
);
```

### API

##### `process(options: Object) -> Promise<String>`
Process a template into text. Takes the following options:
 - `data: String` the template to render
 - `filepath: ?String` where to resolve require's frome
 - `exports: ?Object` the initial exports object your template can use

### Syntax

```php
<?doc
// you have a full node environment to setup exports
exports.foo = "World";
exports.bar = require("./module");
?>

# Interpolate exported values easily with: <?= foo ?>

<?doc
// each doc block is ran inside an async function
exports.result = await new Promise(res => setTimeout(
  res,
  500,
  "value"
));
?>

The result is <?= result ?>

Previous exports still work: <?= bar ?>

<?doc
// this is kind of hacky but it works
for (exports.i = 0; exports.i < 10; exports.i++) { ?>
repeating <?= i ?> times
<?doc } ?>

```
