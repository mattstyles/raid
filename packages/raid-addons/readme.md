# Raid

> Addons and helpers for use with raid

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License](https://img.shields.io/npm/l/raid.svg)](https://www.npmjs.com/package/raid)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![Dependency Status](https://david-dm.org/mattstyles/raid.svg)](https://david-dm.org/mattstyles/raid)
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

Raid does one job, it helps to manage the state of your application. It does this job simply enough but sometimes you want to add some sugar or some extra _stuff_ to tasks you typically do often.

This is a disparate list of add-ons and whilst they were created with Raid in mind they could equally be used with other libraries. They are typically small utility functions and often best used composed together.

See the [examples](https://github.com/mattstyles/raid/blob/master/examples) for more detailed usage.

## Add-ons

### Adaptor

`(<Signal>) => <Function <Function[optional], Component>>`

An adaptor can be attached to a signal and returns a function that can be used to create a higher-order component that has data from the state provided to it, that data will be passed as `props`.

```js
const signal = new Signal({
  title: 'Foo'
})
const connect = adaptor(Signal)

const El = ({title}) => <h1>{title}</h1>
const Title = connect(state => state.title, El)
```

The returned `connect` function should be supplied with a selector function (which is responsible for grabbing parts of the state) and a component function.

The state selector function is optional and the component function will become the first argument if omitted.

* Libraries like [reselect](https://npmjs.com/package/reselect), which help to create the selector function for you, work great with this pattern.

> The source uses JSX to pass through the `Component` and is currently building only for use with [React](https://github.com/facebook/react).

### Compress (Object notation)

`(<Object>) => <Function <state, event>>`

Compress is used to add functions to a particular event type and will assume events are objects of the type `{type, payload}`. This removes the restriction to switch on events within the update function.

This pattern can be applied to simplify attaching update functions to specific events.

```js
const signal = new Signal({
  count: 0
})

const add = (state, payload = {}) => {
  state.count += payload.amount || 1
  return state
}

signal.register(compress({
  'ADD': add
}))

signal.emit({
  type: 'ADD',
  payload: {
    amount: 5
  }
})
```

> The signature of the update function changes semantics slightly as it will now be passed the `payload`, rather than the entire `event` object.

### Compress (String notation)

`(<String>) => <Function <state, event>>`

Compress can also be supplied a string referencing the event type, in this case it will return a function which can be used to attach a function to that event type.

This pattern can be really effective when composing various utilities together to generate update functions.

```js
const signal = new Signal({
  count: 0
})

const add = (state, payload = {}) => {
  state.count += payload.amount || 1
  return state
}

signal.register(compress('ADD')(add))

signal.emit({
  type: 'ADD',
  payload: {
    amount: 5
  }
})
```

> This is a one-to-one mapping between event type and update function, to add more functions to a single event use  [squash](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#squash).

### Squash

`<String> => <Array<Function>> => <Function <state, event>>`

Squash adds several update functions to the same event and runs them sequentially meaning that order can be important.

```js
const signal = new Signal({
  count: 0
})

const add = (state, payload) => {
  state.count += payload
  return state
}

const log = state => {
  console.log('Adding')
  return state
}

signal.register(squash('ADD', [
  add,
  log
]))

signal.emit({
  type: 'ADD',
  payload: 5
})
```

### Flow

`(<arguments<Function>>) => <Function <state, event>>`

Flow is a utility function that creates an update function ready to register with a signal by composing together all functions passed to it as arguments. Updates are invoked serially.

It combines well with [compress](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#compress) to attach several functions to the same event, although [squash](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#squash) can achieve the same functionality.

```js
const signal = new Signal({
  count: 0
})

const add = (state, event) => {
  state.count++
  return state
}

const restrict = mod => (state, event) => {
  if (state.count % 2 !== mod) {
    state.count++
  }
  return state
}

signal.register(flow(
  add,
  restrict(0)
))
```

> It is conceptually identical to [lodash/fp/compose](https://lodash.com) (or compose from any FP library) but returns a function ready to be used as an updater and expects to be supplied with update functions. For general case use of composing functions together, use the implementation provided by your favourite FP library.

### Hook

`(<Function, Object>) => <Function <state, event>>`

Hooks can be used to add update functions to a range of events using a predicate supplied in the `options` parameter. The predicate for whether a hook should invoke or not can be supplied as a `string`, `regex` or `function`.

```js
const signal = new Signal({
  count: 0
})

const ACTIONS = {
  'ADD': 'action:apply',
  'PLUS': 'action:apply'
}

const add = (state, event) => {
  state.count++
  return state
}

signal.register(hook(add, {
  predicate: ACTIONS.ADD
}))

// or
signal.register(hook(add, {
  predicate: /apply$/
}))

// or
signal.register(hook(add, {
  predicate: event => /^action/.test(event.type)
}))

// All 3 predicates would fire for the following event
signal.emit({
  type: ACTIONS.ADD
})
```

> This is a terse example to highlight how to use `hook`, no-one ever needs multiple actions that do the _exact_ same thing, always aim to restrict to the minimal.

### Patch

`<String, Function> => <Function <state, event>>`

Patch allows an update function to have a view on to a specific root-level state key by specifying that key by a string.

```js
const signal = new Signal({
  foo: {
    bar: 'baz'
  },
  count: {
    value: 0
  }
})

const counter = (count, event) =>({
  ...count,
  value: count.value + 1
})

signal.register(patch('count', counter))

// or
signal.register(patch('count')(counter))

signal.emit({type: 'XXX'})
```

In this example `state.foo` will remain unchanged, patch has ensured that the update function only knows about its own key, in this case `count`.

### Safe

`<Function> => <Function <state, event>>`

Safe just wraps an update function to ensure state is always spat out of it. It will default to using the output of an update function, throwing out the state in the event something falsy is returned.

```js
const add = (state, event) => {
  state.count++
}
signal.register(safe(add))
```

### Arc

Arcs can be used to create functions which can handle side effects away from regular update functions by ensuring that async-await can be handled correctly.

Arcs are connected to the signal state and can request copies of it meaning that state inside an arc effectively becomes detached _but_ representative of the system state so it can be inspected but not directly manipulated from within an arc, instead, arcs should fire dispatches to infer state changes.

Once an arc is created by attaching it to a signal the actual function works great combined with something like [compress](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#compress) to attach it to a specific event.

```js
const signal = new Signal({
  count: 0
})

const add = compress({
  ADD: safe((state, payload) => {
    state.count += payload
  })
})

const delay = ms => ({
  then: cb => setTimeout(cb, ms)
})

const wait = compress({
  WAIT: (getState, payload) => {
    console.log(getState())
    signal.emit({
      type: 'ADD',
      payload: 5
    })
    await delay(1000)
    console.log(getState())
  }
})

signal.register(add)
signal.register(arc(signal)(wait))

signal.emit({type: 'WAIT'})
```

### Sin

Sin is another way to use async-await but its far less safe as it allows asynchronous functions to try to return state and become regular update functions. It is included as an example of using asynchronous update functions but `arc` should be preferred.

## Running tests

```sh
$ yarn
$ yarn test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `yarn test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

See the root [readme](https://github.com/mattstyles/raid) for more information about how the repository is structured.

## License

MIT
