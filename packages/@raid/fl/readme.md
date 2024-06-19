
# @raid/fl

> Raid with support for [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant structures

[![npm](https://img.shields.io/npm/v/@raid/fl.svg?style=flat)](https://www.npmjs.com/package/@raid/fl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid @raid/fl
```

```sh
npm i -S raid @raid/fl
```

Raid does one job, it helps to manage the state of your application. @raid/fl adds some algebraic types to helpers to allow you to use [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant structures to manage your application state.

See the [examples](https://github.com/mattstyles/raid/tree/master/packages/examples/examples) for more detailed usage.

> By default `@raid/fl` outputs a build for modern environments, however, this creates a problem for some build tools as they don’t always understand some `esnext` syntax. Either use minification/build tooling that does or consider using `@raid/fl/compat`, see the [interoperabilty section](https://github.com/mattstyles/raid/tree/master/packages/raid-fl#interoperability) for more details.

## Action Types

Raid, by default, has an action (or event) model that looks like:

```
{
  type: <String>,
  payload: <Object>
}
```

@raid/fl builds on this event structure to add helpers to create specific action creators which type actions and pack their payloads into a [fantasy-land](https://github.com/fantasyland/fantasy-land) compliant structure that implements Monad, Functor, Applicative, and Setoid.

To use typed actions you first need to create a function that can create them for you:

```js
import { createAction } from '@raid/fl'

var ChangeTitle = createAction('change-title')
```

This sets up a `ChangeTitle` object which can be used to create actions and later identify those actions via their type, for example:

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

## Connected action types

Actions can be connected directly to a signal so that when they are instantiated they trigger an emit from the connected signal.

```js
import { Signal } from 'raid'
import { connect } from '@raid/fl'

const signal = Signal.of({})
const createActions = connect(signal)

const [reset] = createActions(['reset'])

signal.register((state, event) => {
  console.log(event)
  return state
})

reset.of()
// reset {__value: undefined}
```

## Interoperability

Mostly typed and untyped events will work in the same codebase as whatever code you use inside your updates should work fine with both, however, for situations where you want to convert the structure of an argument `@raid/fl` implements two transform helpers which can provide interoperability with modules whose actions are strings/types or whose updates expect strings/types.

```js
import { typeEvent, untypeEvent } from '@raid/fl'

signal.register(typeEvent(typedUpdate))
signal.register(untypeEvent(untypedUpdate))
```

Untyping an event is a fairly trivial operation and the function accepts only the update to supply untyped events to, however, typing events requires storing the action creators. These action creators are stored in a global store object by default which means that actions can be shared between updates, however, where this is undesirable you can also supply an object to store the types in:

```js
signal.register(typeEvent(update, {}))
```

For situations where you are using connected events you can also pass through the function used to create actions:

```js
import { connect, typeEvent } from '@raid/fl'

const createActions = connect(signal)

signal.register(typeEvent(update, {}, createActions))
```

The only restriction here is that `typeEvent` expects the `createActions` function to expose actions that can be created via `Action.of`, this works fine with connected actions but you could use the `typeEvent` transform to create completely different events, or add meta to an event or anything else.

## Compatibility build

@raid/fl outputs a build for modern browsers which gives named actions output for Safari and Node but if you are supporting older browsers there is also a compat build that will apply more aggressive transpilation. The compat build can be accessed via `/compat`:

```js
import { createAction } from '@raid/fl/compat'
```

## API

### createAction

`<String> => <Action>`

Create action returns an action creator which can be used to instantiate actions.

```js
import { createAction } from '@raid/fl'

const reset = createAction('reset')

const action = reset.of()
```

### createActions

`<Array<String>> => <Array<Action>>`

Create action returns an action creator which can be used to instantiate actions.

```js
import { createActions } from '@raid/fl'

const [reset] = createActions(['reset'])

const action = reset.of()
```

### connect

`<Signal> => <Function>`

Connect accepts a signal and returns a function which can be used to create action which are connected to that signal meaning that instantiation of the action forces the signal to emit.

```js
import { connect } from '@raid/fl'

const createActions = connect(signal)
const [reset] = createActions(['reset'])

reset.of()
// This triggers a signal event
```

### typeEvent

`(<Function<state, event>>, <?Object>, <?Function<Array<String>>>) => <Function<state, event>>`

`typeEvent` allows a supplied update function to receive only typed events. The consumer can also supply an object for storing action creators as well as a function to create action creators.

```js
import { typeEvent } from '@raid/fl'

const signal = Signal.of({count: 0})
const update = (state, event) => {
  if (event['@@type'] === 'reset') {
    return {
      count: 0
    }
  }

  if (event['@@type'] === 'apply') {
    return {
      count: state.count + event.join()
    }
  }

  return state
}

signal.register(typeEvent(update))

signal.emit({type: 'reset'})
signal.emit({type: 'apply', payload: 1})
```

In this example even though the signal is emitting events with a string type the update receives them as typed actions.

### untypeEvent

`<Function<state, event>> => <Function<state, event>>`

Untyping an event is a little easier and ensures that an update function only receives `{ type, payload }` events.

```js
import { untypeEvent, createActions } from '@raid/fl'

const signal = Signal.of({count: 0})
const [apply, reset] = createActions([
  'apply',
  'reset'
])
const update = (state, event) => {
  if (event.type === 'reset') {
    return {
      count: 0
    }
  }

  if (event.type === 'apply') {
    return {
      count: state.count + event.payload
    }
  }

  return state
}

signal.register(untypeEvent(update))

signal.emit(apply.of(1))
signal.emit(reset.of())
```

## Running tests

```sh
$ yarn install
$ yarn test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `yarn test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

See the root [readme](https://github.com/mattstyles/raid) for more information about how the repository is structured.

## License

MIT
