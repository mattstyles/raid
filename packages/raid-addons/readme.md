
# @raid/addons

> Addons and helpers for use with raid

[![npm](https://img.shields.io/npm/v/@raid/addons.svg?style=flat)](https://www.npmjs.com/package/@raid/addons)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid @raid/addons
```

```sh
npm i -S raid @raid/addons
```

Raid does one job, it helps to manage the state of your application. It does this job simply enough but sometimes you want to add some sugar or some extra _stuff_ for tasks you typically do often.

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

### Plug

`(<Signal>) => <Function <Function[optional], Component>> => <Function <Any[optional]>>`

A plug is functionally identical to `adaptor`, but without the property massaging to be used any component specification i.e. it can be used with raw functions instead.

Plug returns a `connect` function which can be used to decorate a function and pass through state from a Raid Signal.

```js
const signal = new Signal({
  foo: 'hello'
})
const connect = plug(signal)

const hof = (
  state => state.foo,
  (state, passed) => {
    console.log(state, ':', passed)
  }
)

hof('world')
// hello : world
```

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

### Debug

`<String> => <Function<state, event>>`

> _Warning_ Creates side effects

Debug creates an update function that logs the current state and the event being passed through the fold. Be aware of when you register the debug update with a signal i.e. if it is registered first then it will get the current state _before_ any mutation has occurred from another update function, if it is registered last then you’ll get the state after an update mutation has occurred.

Debug accepts a single argument when instantiating the update function and this is a string that will be prepended to the event type.

```js
signal.register(debug('::'))
```

Adding debug twice to the top and bottom of your registered updates can give you the previous and next states but be aware that any updates that are registered later in your program will appear _after_ the final debug, which is often less than ideal.

```js
signal.register(debug('>>'))
signal.register(update)
signal.register(debug('<<'))
```

Debug is either on or off and it is up to the consumer to remove it from production builds if required, if your build process does dead-code removal then something like the following could be used:

```js
if (process.env.DEBUG) {
  signal.register(debug())
}
```

Or you may wish to implement a more complicated method that checks for the existence of a variable in local storage (for example) and choose whether to register the debug update or not. You could even take this one step further and make it dynamic, something like the following:

```js
const passthrough = (state, event) => state
const checkStorage = key => update => {
  return window.localStorage.getItem(key)
    ? update
    : passthrough
}
const checkDebug = checkStorage('DEBUG')

signal.register(checkDebug(debug('::')))
```

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

### Match

`<Array <Array <Function, Function>>> => <Function <state, event>>`

Match provides a form of pattern matching for events by allowing consumers to supply a predicate function to do the matching and an arm function that returns a new representation of the state to pass back to the signal. This is tied to how the [match library](https://www.npmjs.com/package/@mattstyles/match) implements pattern matching.

Match automatically adds a default case on to the pattern matching so consumers should not supply one.

Predicate functions match only on the event. If you need to also match on the current state then consider wrapping in [scope](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#scope) with a state predicate function.

Arm functions are expected to be regular update functions with a signature of `<state, event>`.

```js
const is = type => event => event.type === type
const cap = str => str.replace(/^./, m => m.toUpperCase())

signal.register(match([
  [is('change_title'), (state, {payload}) => {
    ...state,
    title: payload
  }],
  [is('capitalise_title'), state => {
    ...state,
    title: cap(state.title)
  }]
]))
```

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

Safe just wraps an update function to ensure state is always spat out of it. It will default to using the output of an update function, throwing out the state in the event undefined is returned.

```js
const add = (state, event) => {
  state.count++
}
signal.register(safe(add))
```

### Scope

`<Function|String|Regex, Function> => <Function <state, event>>`

Scope provides a short-circuit so that the update function only executes when a certain condition is met, that condition can be specified as a string or regex that will match against the event type (or just the event if it is a string) or as a function which will accept both state and event as parameters so that the scoping can be defined by either current application state, event parameters or a combination of both.

Scoped updates have two primary use-cases:

* Remove application logic from components and move it into update functions.
* Handle global action emitters without the need to start/stop streams i.e. http requests, keyboard input streams or some sort of external feed updates.

```js
const predicate = (state, event) =>
  state.isModalVisible && event.type === 'foo'

const update = (state, event) => ({
  ...state,
  foo: event.payload
})

signal.register(scope(predicate, update))
```

Scope can also be called with just the predicate function, allowing an update to be attached later.

```js
const isMain = scope(state => state.appState === 'main')

const update = (state, event) => ({
  ...state,
  foo: event.payload
})

signal.register(isMain(update))
```

> Using scope to match against certain actions is fine, but consider if [compress](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#compress) would be a better solution.

### Lock

`(<Signal>) => <Function <state, event>> => <Function <void>>`

Lock provides a mechanism whereby only one function registered through the lock will be active at any one time on a signal, i.e. it locks the signal for the **last** function supplied through the lock register function. Lock returns a function which can be used to register updates to a signal, this registration function will return a dispose function for each update to remove them from the signal.

```js
const signal = Signal.of({})
const register = lock(signal)

const dispose1 = register(safe(() => {
  console.log('one')
}))
signal.emit({})
// one

// ...later
const dispose2 = register(safe(() => {
  console.log('two')
}))
signal.emit({})
// two

// ...later
dispose2()
signal.emit({})
// one
```

Note that signal emissions are delayed a tick to be consistent so asynchronicity is something that needs to be considered i.e. the above example, run as written, will not work as you expect as the 2nd update function will be registered and disposed (whereby registering the 1st one again) synchronously whilst the emission will be on the next tick, leading to only 'one' being logged to the console.


### Arc

Arcs can be used to create functions which can handle side effects away from regular update functions by ensuring that async-await can be handled correctly.

Arcs are connected to the signal state and can request copies of it meaning that state inside an arc effectively becomes detached _but_ representative of the system state so it can be inspected but not directly manipulated from within an arc, instead, arcs should fire dispatches to infer state changes.

Once an arc is created by attaching it to a signal the actual function works great combined with something like [compress](https://github.com/mattstyles/raid/blob/master/packages/raid-addons/readme.md#compress) to attach it to a specific event.

```js
const signal = new Signal({
  count: 0
})

const signalArc = arc(signal)

const add = compress({
  ADD: safe((state, payload) => {
    state.count += payload
  })
})

const delay = ms => ({
  then: cb => setTimeout(cb, ms)
})

const wait = compress({
  WAIT: (getState, payload, signal) => {
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
signal.register(signalArc(wait))

signal.emit({type: 'WAIT'})
```

### Sin

Sin is another way to use async-await but its far less safe as it allows asynchronous functions to try to return state and become regular update functions. It is included as an example of using asynchronous update functions but `arc` should be preferred.

## Running tests

```sh
$ npm
$ npm test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/raid/issues).

See the root [readme](https://github.com/mattstyles/raid) for more information about how the repository is structured.

## License

MIT
