
# Raid

> Centralised state container

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![Dependency Status](https://david-dm.org/mattstyles/raid.svg)](https://david-dm.org/mattstyles/raid)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid
```

```sh
npm i -S raid
```

* [Getting started with raid](https://github.com/mattstyles/raid/tree/master/packages/raid)
* [Utilities and complementary functions](https://github.com/mattstyles/raid/tree/master/packages/raid-addons)
* [Input streams](https://github.com/mattstyles/raid/tree/master/packages/raid-streams)
* [Typed actions](https://github.com/mattstyles/raid/tree/master/packages/raid-fl)
* [Documentation](https://mattstyles.github.io/raid/)

## Quick Start

Raid has a complementary `create-raid-app` package that will scaffold out a project ready to start raiding.

```sh
mkdir my-awesome-project
npm i -g create-raid-app
create-raid-app
npm start -- -o
```

You can also scaffold using `npx`

```sh
npx create-raid-app
```

## Examples

The Raid codebase has been written to encourage collaboration and uses [lerna](https://lernajs.io/) to implement a monorepo.

To get going you can let lerna do the heavy lifting so you simply need to clone the repository, install the root dependencies and then let lerna hook things together.

To fire in to the examples run `npm start` after letting lerna hook things up. This is also a live development environment and will automatically reload the browser when there are changes to any of the packages.

```sh
$ npm i
$ npm run setup
$ npm start -- -o
```

## Running tests

```sh
$ npm i
$ npm run setup
$ npm test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

## License

MIT
