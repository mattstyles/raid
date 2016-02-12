
# Installation

Use npm to install Raid

```sh
npm i -S raid
```

To use raid you’ll need something that can use commonJS modules, the following code imports the Raid module and creates a new state instance.

```js
// index.js
var Raid = require( 'raid' )

var state = new Raid.State()
```

The following steps compile this for the browser using [browserify](http://browserify.org/), although there are other packagers

```sh
browserify index.js > bundle.js
```

The rest of the code examples will use ES2015 modules and so (currently) require transpilation using something like [babel](https://babeljs.io/)
