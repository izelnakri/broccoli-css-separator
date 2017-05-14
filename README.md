# Split Your CSS data With Broccoli
============

Pass your tree to broccoli-css-seperator and it will split all data uri's
 (eg. inline background images in foo.css) into a separate file (foo-data.css) using [postcss-separator](https://github.com/Sebastian-Fitzner/postcss-separator).

Be sure to select CSS files *only* in your input tree. `broccoli-caching-writer` will ensure that it can skip if the files have not changed. Be sure to disable sourcemaps (postcss doesn't handle comments) and to use it only in production (because it can be slow).

Code inspired by [broccoli-csssplit](https://github.com/aboekhoff/broccoli-csssplit)

```js
var separator = require('broccoli-separator');
var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var cssTree = funnel(appTree, {
	include: [ "**/*.css", "**/*.html" ]
});
appTree = funnel(appTree, {
	exclude: [ "**/*.css", "**/*.html" ]
});
var splitTree = separator(cssTree);
appTree = mergeTrees([appTree, splitTree]);
// fingerprint & integrity
appTree = assetRev(appTree, {
	replaceExtensions: ['html']
});
appTree = integrity(appTree);
```

## License
Copyright (c) 2017 Frans Twisk. Licensed under the MIT license.
