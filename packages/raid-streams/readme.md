
# Raid-streams

> Collection of event streams ready to mount to raid

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![Dependency Status](https://david-dm.org/mattstyles/raid.svg)](https://david-dm.org/mattstyles/raid)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Raid Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid raid-streams
```

```sh
npm i -S raid raid-streams
```

Raid does one job, it helps to manage the state of your application. It does this job by piping action events through streams to observers who then decide what to do with that action.

An application typically involves a number of different input streams that emit actions, such as a button press action.

This is a disparate collection of input streams and whilst they were created with Raid in mind they could equally be used with other libraries. They always emit a Raid action signature `{type<string>, payload<any>}` and they are [most.js](https://npmjs.com/packages/most) streams which can be composed together to create more complex inputs.

See the [examples](https://github.com/mattstyles/raid/blob/master/examples) for more detailed usage.

## Streams

Each collection of input streams typically exports a stream that can be consumed and an enum of actions that may be emitted.

## Keys

The key streams convert regular key events into reliably emitted events. The natural key repeat behaviour is often inappropriate for applications and registering multi-key combos can get tricky, these input streams simplify listening to such events.

Keys are referenced using their [vkey](https://www.npmjs.com/package/vkey) definitions, i.e. keydown for the enter key emits an event containing `key: '<enter>'`.

### Actions

* `keydown` Initial keydown event, happens only once per key depression.
* `keyup` Triggered when the key is released.
* `keypress` Emitted regularly on the animation frame whilst a key is pressed.
* `sequence` Emits an array of the most recently pressed keys.
* `timedSequence` Emits a sequence of keys pressed within a time window.

### Keys

```js
import keystream, {actions} from 'raid-streams/keys'
import {Signal} from 'raid'

const signal = new Signal({key: ''})

// Mount the keystream to the signal
signal.mount(keystream())

// Respond to key events
signal.register((state, event) => {
  if (event.type === actions.keydown) {
    state.key = event.key
  } else {
    state.key = ''
  }
  return state
})
```

### keydown

`<Function <Object>> => <Object>`

Keydown accepts only a reference to a keys pressed map, this is a required option:

```js
{
  <Map> keys [required]
}

signal.mount(keydown({
  keys: new Map()
}))
```

Keydown fires on initial keydown event when pressing a key and emits an event of the type:

```js
{
  <String> key,
  <String> type,
  <Map> keys,
  <HTMLDomEvent> event
}
```

```js
import keydown, {actions} from 'raid-streams/keys'

signal.mount(keydown())

signal.register((state, event) => {
  if (event.type === actions.keydown) {
    state.key = event.key
  }
  return state
})
```

### keyup

`<Function <Object>> => <Object>`

Keyup accepts only a reference to a keys pressed map, this is a required option:

```js
{
  <Map> keys [required]
}
```

Keyup fires when a key is released and emits an event of the type:

```js
{
  <String> key,
  <String> type,
  <Map> keys,
  <HTMLDomEvent> event
}
```

```js
import keydown, {actions} from 'raid-streams/keys'

signal.mount(keydown())

signal.register((state, event) => {
  if (event.type === actions.keyup) {
    state.key = event.key
  }
  return state
})
```

### keystream

Keystream emits keydown, keyup and keypress events. The keypress event fires when a key is pressed at an interval equalling `requestAnimationFrame`.

Keystream has no initialisation properties that can be set and will create its own keypress map.

The event signature for keyup and keydown matches the underlying key streams they come from, the keypress event signature is slightly simpler as its only concern is that _something_ has been pressed:

```js
{
  <String> type,
  <Map> keys
}
```

The keystream map holds how long a key has been pressed for mapped against its [vkey](https://www.npmjs.com/package/vkey) definition.

```js
import keydown, {actions} from 'raid-streams/keys'

signal.mount(keystream())

signal.register((state, event) => {
  if (event.type === actions.keydown) {
    state.key = event.key
  }

  if (event.type === actions.keyup) {
    state.key = ''
  }

  if (event.type === actions.keypress) {
    if (event.keys.has('<enter>')) {
      // Grab the delta of the keypress from the key map
      state.heldDownFor = event.keys.get('<enter>')
    }
  }

  return state
})
```

### keySequence

KeySequence keeps track of the last `x` keydown events and emits an array of keys.

KeySequence options object looks like:

```js
{
  <Number> length [optional]: 10,
  <Map> keys [optional]: null
}

signal.mount(keySequence({
  length: 10
}))
```

The event signature looks like:

```js
{
  <String> type,
  <Array <String>> keys
}
```

```js
import keySequence, {actions} from 'raid-streams/keys'

signal.mount(keySequence())

signal.register((state, event) => {
  if (event.type === actions.sequence) {
    state.sequence = event.keys
  }

  return state
})
```

### timedKeySequence

timedKeySequence keeps track of the last `x` keydown events from the last `y` ms.

The options object looks like:

```js
{
  <Number> length [optional]: 10,
  <Map> keys [optional]: null,
  <Number> timeout [optional]: 200
}

signal.mount(timedKeySequence({
  length: Number.MAX_SAFE_INTEGER,
  timeout: 300
}))
```

The event signature looks like:

```js
{
  <String> type,
  <Array <String>> keys
}
```

```js
import keySequence, {actions} from 'raid-streams/keys'

signal.mount(timedKeySequence())

signal.register((state, event) => {
  if (event.type === actions.timedSequence) {
    state.sequence = event.keys
  }

  return state
})
```

## Stand-alone streams

All these action streams are just regular [most.js](https://npmjs.com/packages/most) streams and can be consumed as normal, there is no restriction to use them with Raid. The only tie they have to Raid is that they emit `{type, payload}` objects.

```js
import keystream, {actions} from 'raid-streams/keys'

keystream.observe(({type, payload}) => {
  if (type === actions.keydown) {
    console.log(`Pressing ${payload.key}`)
  }
})
```

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
