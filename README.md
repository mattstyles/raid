# Raid

> Centralised state container

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License](https://img.shields.io/npm/l/raid.svg)](https://www.npmjs.com/package/raid)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=composer)](https://travis-ci.org/mattstyles/raid)
[![npm version](https://badge.fury.io/js/raid.svg)](https://badge.fury.io/js/raid)
[![Dependency Status](https://david-dm.org/mattstyles/raid.svg)](https://david-dm.org/mattstyles/raid)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Getting Started

Install with [npm](https://npmjs.com)

```sh
npm i -S raid
```

Raid manages the state layer by providing an observable that supplies the current state of the application.

```js
import {Signal} from 'raid'

const signal = new Signal({
  count: 0
})

signal.observe(state => {
  // Current signal state
})
```

State is held within the signal, changes can be triggered by emitting action objects and using mutator functions to mutate the state.

```js
import {Signal} from 'raid'

const signal = new Signal({
  count: 0
})

// Mutator
signal.register(state => {
  // Mutations occur here
  state.count++
  return state
})

// Observable
signal.observe(state => {
  // Current signal state
  console.log(state)
})

// Emit action
signal.emit({
  type: 'ADD'
})
```

Raid works great with immutable state objects to ensure that all mutations occur within the mutators, although this is not enforced, it’ll work great with regular javascript structures too.

## Examples

Clone the repository, install the dependencies and run the examples.

```sh
npm install
npm start -- -o
```

## Running tests

```sh
$ npm install
$ npm test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue]().

## License

ISC
