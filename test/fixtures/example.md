```setup

exports.foo = "World";
exports.bar = await Promise.resolve("bar");
```


# Hello {{foo}}

> Foo {{bar}} baz qux.

Hello {{bar}} this is {{foo}}.

```setup
exports.result = new Promise(res => setTimeout(
  res,
  500,
  "value"
));
```

The result is {{result}}

also.. you can use previous exports: {{bar}}
