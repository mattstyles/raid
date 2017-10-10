
# create-raid-app

> Code generation tooling for use with a raid-powered application

[![npm](https://img.shields.io/npm/v/create-raid-app.svg?style=flat)](https://www.npmjs.com/package/create-raid-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Getting Started

> `create-raid-app` requires node version > 8 for async support.

First time use involves globally installing `create-raid-app` which will also place `create-raid-app` into your path, after that any calls will defer to a locally installed version which means that each project can use a different version easily (or even a fork).

Install globally with [npm](https://npmjs.com) and invoke to scaffold a new project.

```sh
npm i -g create-raid-app
create-raid-app
```

Once a new project is scaffolded and installed a live-reloading development environment can be run using,

```sh
npm start -- -o
```

`create-raid-app` contains some basic documentation for each instruction, simply append `--help` to the call to get more details on how to use it, e.g.

```sh
create-raid-app --help
create-raid-app create component --help
```

* [Getting started with raid](https://github.com/mattstyles/raid/tree/master/packages/raid)
* [Utilities and complementary functions](https://github.com/mattstyles/raid/tree/master/packages/raid-addons)
* [Input streams](https://github.com/mattstyles/raid/tree/master/packages/raid-streams)
* [Typed actions](https://github.com/mattstyles/raid/tree/master/packages/raid-fl)
* [Documentation](https://mattstyles.github.io/raid/)

## Example project structure

`create-raid-app` is necessarily opinionated about how you structure your application and the additional code generation tools will expect you to adhere to this structure.

Unlike [create-react-app](https://www.npmjs.com/package/create-react-app) (which was clearly an inspiration) the build process that is scaffolded with the initial application is inlined in to your project, whilst this provides some additional bloat to your project it realises that many projects differ and small changes to the build processes becomes trivial by making them live with your project. If you never need to touch the build then there is no requirement to do so, everything will work out-of-the-box.

```
.
├── bin
│   └── start
├── package.json
├── package-lock.json
├── readme.md
├── spec
└── src
    ├── assets
    ├── components
    │   └── title.jsx
    ├── core
    │   ├── actions.js
    │   ├── constants.js
    │   ├── selectors.js
    │   └── updates.js
    ├── index.html
    ├── main.js
    ├── signals
    │   └── index.js
    ├── utils
    │   └── index.js
    └── views
        └── app.jsx
```

Best way to get started is to run `create-raid-app` and have it scaffold a project for you. Be sure to also try `create-raid-app create component`, use `--help` to get more information.

`create-raid-app` very consciously sets up a fairly minimal project structure, as each project is unique so are it’s requirements as it grows, initially all `create-raid-app` wants is for you to get up and running fast. When (if?) your project specifics start to form and the above structure is no longer viable then it may be time to extend `create-raid-app` with additional features, see the next section on extending `create-raid-app`.

## Extending `create-raid-app`

There is no formal configuration for `create-raid-app` and it wants to remain as easy to use as possible, this leaves forking as the simplest solution to creating a different base scaffold process or adding additional commands that may be unique to your application, structure and preferences.

As the `create-raid-app` global defers to any local version if you install a specific fork in to your `node_modules` then `create-raid-app` will continue to work as you need.

See the existing `create-raid-app` structure for examples of how to create your own commands and templates.

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

## License

MIT
