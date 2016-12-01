
# Installation

Use npm to install Raid

```sh
npm i -S raid
```

To use raid you’ll need something that can use commonJS modules, the following code imports the Raid module and creates a new state instance.

```js
// index.js
var Raid = require('raid')

var signal = new Raid.Signal()
```

The following steps compile this for the browser using [browserify](http://browserify.org/), although there are other packagers

```sh
browserify index.js > bundle.js
```

The rest of the code examples will use ES2015 modules and so (currently) require transpilation using something like [babel](https://babeljs.io/).

## Example Babel setup

> None of this is strictly necessary, outside of the module bundler, use whatever you prefer, Raid doesn’t care.

A good starting point would be to use the [ES2015](https://babeljs.io/docs/plugins/preset-es2015/) preset; the [object-rest-spread](https://babeljs.io/docs/plugins/transform-object-rest-spread/) plugin also fits quite well.

Make sure to add a preset for your rendering engine syntax, if it differs from JS, the examples here expect React so the [React](https://babeljs.io/docs/plugins/preset-react/) preset is required which can handle our JSX. The view layer used with Raid is agnostic, the examples in the repository use [InfernoJS](https://github.com/trueadm/inferno) as a rendering layer.

Adding the following to your `package.json` would set up babel and browserify to do their thing, but there are a number of different transformers and bundlers that would equally do a good job:

```json
"scripts": {
  "build": "browserify index.js > bundle.js"
},
"browserify": {
  "transform": [
    "babelify"
  ]
},
"babel": {
  "presets": [
    "es2015",
    "react"
  ],
  "plugins": [
    "transform-object-rest-spread"
  ]
}
```

Install the following and you should be ready to start firing any code examples here into a browser:

```sh
npm i -S raid react react-dom
npm i -D browserify babelify babel-preset-es2015 babel-preset-react babel-plugin-transform-object-rest-spread

npm run build
```
