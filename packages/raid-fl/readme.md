
# Raid-fl

> Raid with support for [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant structures

[![npm](https://img.shields.io/npm/v/raid-fl.svg?style=flat)](https://www.npmjs.com/package/raid-fl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid raid-fl
```

```sh
npm i -S raid raid-fl
```

Raid does one job, it helps to manage the state of your application. Raid-fl adds some algebraic types to helpers to allow you to use [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant structures to manage your application state.

See the [examples](https://github.com/mattstyles/raid/blob/master/examples) for more detailed usage.

## Action Types

Raid, by default, has a deliberately simplistic action (or event) model that looks like:

```
{
  type: <String>,
  payload: <Object>
}
```

This is a common pattern for JS libraries and allows the consumer to specify their actions (or events) using strings as identifiers.

Raid-fl builds on basic events to add helpers to create specific action creators which type actions and pack their payloads into a [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant structure that implements Monad, Functor, Applicative, and Setoid.

To use typed actions you first need to create a function that can create them for you:

```js
import {createAction} from 'raid-fl'

var ChangeTitle = createAction('change-title')
```

This sets up a `ChangeTitle` class which can be used to create actions and later identify those actions via their type, for example:

```js
import Signal from 'raid'

const signal = Signal.of({
  title: 'bar'
})

// Publishing
signal.emit(ChangeTitle.of('foo'))

// Subscribing
signal.register((state, event) => {
  if (ChangeTitle.is(event)) {
    return {
      ...state,
      title: event.join()
    }
  }

  return state
})
```

Actions expose a static `is` method which performs an `instanceof` check on the event passed through. This allows typed actions to be introduced slowly in to a code base as regular Raid actions won’t satisfy `Action.is` and will be picked up by other update functions.

Actions are boxed to implement Monad, Functor, Applicative and Setoid so they have a number of methods to comply with the fantasy-land specification for these types, it also means that your updates will typically need to unwrap the box at some point, `join` performs this unboxing although you could choose to map over the value of the action to provide a mutation to the state.

## Running tests

```sh
$ npm install
$ npm test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

See the root [readme](https://github.com/mattstyles/raid) for more information about how the repository is structured.

## License

MIT
