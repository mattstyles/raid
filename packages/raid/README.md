
# Raid

> De/Centralised state container

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License](https://img.shields.io/npm/l/raid.svg)](https://www.npmjs.com/package/raid)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid
```

```sh
npm i -S raid
```

Raid manages the state layer by providing an observable that supplies the current state of the application.

```js
import { Signal } from 'raid'

const signal = Signal.of({
  count: 0
})

signal.observe(state => {
  // Current signal state, typically a side effect
  console.log(state)
})
```

State is held within the signal and changes can be triggered by emitting action objects and using update functions to mutate the state.

```js
import { Signal } from 'raid'

const signal = Signal.of({
  count: 0
})

// Update function
signal.register(state => {
  // Mutations occur here
  // Up to you if you want to mutate or return new objects
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

Raid works great with immutable state objects to ensure that all mutations occur within the update functions, although this is not enforced, it’ll work great with regular javascript structures too.

Further reading exists in the [documentation](https://mattstyles.github.io/raid/).

Additionally there are a number of [examples](https://github.com/mattstyles/raid/tree/master/packages/examples/examples) and [test cases](https://github.com/mattstyles/raid/tree/master/packages/raid/spec).

See the [changelog](https://github.com/mattstyles/raid/blob/master/changelog.md#breaking-changes) for details regarding changes between major versions. Raid adheres to [semantic versionin](https://semver.org/) and strives to keep breaking changes to a minimum and provide upgrade instructions (or codemods) where necessary.

## Applying updates

Update functions are applied to the signal using the `register` method, which accepts an update function.

```js
signal.register((state, event) => {
  return state
})
```

An update function is always of the form:

```
(state: Object<any>, event: EventObject) => state: Object<any>

// EventObject
{
  type: String,
  payload: Object<any>
}
```

_Note that whilst type is assigned as a string here, which is usual, it needn't be and any type would work. See the [actions](https://github.com/mattstyles/raid/tree/master/packages/examples/examples/actions/index.js) example for a differing implementation._

Update functions must always return the new (or mutated) state object, or the next update function in the chain (or, if the last or only, the observers will get it) will receive a void state object.

See [safe](https://github.com/mattstyles/raid/tree/master/packages/raid-addons#safe) from `@raid/addons` for a [higher order function](https://en.wikipedia.org/wiki/Higher-order_function) to ensure state is returned from updates.

`signal.register` can additionally take an options object, which is currently only used to assign a key to the update function, and returns a function which can be used to remove (dispose) the update function from the signal:

```
// signal.register
(update: Function(<state>, <event>), options: Object<RegisterOptions>) => Function(<void>)

// RegisterOptions
{
  key: String
}
```

_Note that whilst the type of `key` is assigned as a string here, which is usual, anything would work so long as it can be used a key for [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)._

Further reading exists in the [documentation](https://mattstyles.github.io/raid/).

## Attaching observers

Observers are usually where your side effects will live (although nothing in Raid mandates this) and receive the current state object moving through the signal when attached and on every emit through the stream.

_Note that pre-version 6 signal observers attached after the signal is created would not receive an immediate execution. This change is to allow a reactive model where observer side effects can run immediately. As observers typically perform updates elsewhere in the system (a GUI or TUI, for example), this is usually what you want and avoids potentially costly re-renders to work around._

```js
signal.observe(state => {
  console.log(state)
})
```

Observer functions should always take the form:

```
(state: Object<any>) => void
```

The `signal.observe` function itself accepts a `next` and an `error` observer (which will fire if an error is detected) and an options object:

```
// signal.observe
(next: Function<state>, error: Function<Error>, options: Object<ObserveOptions>) => void

// ObserveOptions
{
  key: String,
  subscription: {
    next: Function<state>,
    error: Function<error>,
    complete: Function<state>
  }
}
```

_Note that `key` is declared as a String here, which is usual, but anything that can be used as a key within a [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) would work._

If a `subscription` object is supplied as an option then it will take precedence over `next` and/or `error` parameters and be used as outputs of the stream. The `complete` function is mentioned above for completeness, Raid signals typically never complete as they are the stream form of event emitters.

`signal.subscribe` exists as an alias to `signal.observe`.

## Managing a signal lifecycle

Signals have a clean and minimal API and each function that creates resources will return a function to remove them, i.e.

```js
const dispose = signal.register(updateFn)
const detach = signal.observe(observeFn)
```

Signals will keep track of updates and observers and provides methods to clean up when (if?) you want to destroy a signal:

```js
signal.detachAll()
signal.disposeAll()
```

## Using keys to keep track of resources

Raid will manage resources for you and provide functions when you do want to perform clean-up, however, if you’d prefer to supply a key then you can:

```js
signal.register(fn, {
  key: 'uid for an update function'
})

signal.observe(fn, {
  key: 'uid for an observer'
})
```

Both `register` and `observe/subscribe` will return functions to clean up, but you can use the key to remove them:

```js
// Dispose is to register
signal.dispose('uid for an update function')

// Detach is to observe
signal.detach('uid for an update function')
```

## Applying functions to updates

Raid Signals can additionally keep a stack of functions to apply to every update passing through the stream. They are applied lazily so can be added and removed and will execute for every update on every emit.

```js
signal.apply(fn => (state, event) => fn(state, event))
```

Applicator functions are [higher-order functions](https://en.wikipedia.org/wiki/Higher-order_function) that accept an update function to decorate.

An example is using [safe](https://github.com/mattstyles/raid/tree/master/packages/raid-addons#safe) from `@raid/addons` to ensure that updates within the signal always return a state.

```js
import { safe } from '@raid/addons'

signal.apply(safe)
```

## Running tests

```sh
yarn
yarn test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `yarn test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

See the root [readme](https://github.com/mattstyles/raid) for more information about how the repository is structured.

## License

MIT
