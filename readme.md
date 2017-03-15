# Raid

> Centralised state container

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License](https://img.shields.io/npm/l/raid.svg)](https://www.npmjs.com/package/raid)
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

* [Getting started with raid](https://github.com/mattstyles/raid/blob/master/packages/raid/readme.md)
* [Utilities and complementary functions](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md)
* [Documentation](https://mattstyles.github.io/raid/)

## Examples

The Raid codebase has been written to encourage collaboration and uses [lerna](https://lernajs.io/) to implement a monorepo.

To get going you can let lerna do the heavy lifting so you simply need to clone the repository, install the root dependencies and then let lerna hook things together.

To fire in to the examples run `yarn start` after letting lerna hook things up. This is also a live development environment and will automatically reload the browser when there are changes to any of the packages.

```sh
$ yarn
$ yarn run setup
$ yarn start -- -o
```

## Running tests

```sh
$ yarn
$ yarn run setup
$ yarn test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `yarn test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue]().

## License

MIT
