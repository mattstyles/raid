
# @raid/streams

> Collection of event streams ready to mount to raid

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/@raid/streams)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/raid.svg?branch=master)](https://travis-ci.org/mattstyles/raid)
[![Coverage Status](https://coveralls.io/repos/mattstyles/raid/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/raid?branch=master)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[Raid Documentation](https://mattstyles.github.io/raid/)

## Getting Started

Install with [yarn](https://yarnpkg.com) or [npm](https://npmjs.com)

```sh
yarn add raid @raid/streams
```

```sh
npm i -S raid @raid/streams
```

Raid does one job, it helps to manage the state of your application. It does this job by piping action events through streams to observers who then decide what to do with that action.

An application typically involves a number of different input streams that emit actions, such as a button press action.

This is a disparate collection of input streams and whilst they were created with Raid in mind they could equally be used with other libraries. They always emit a Raid action signature `{type<string>, payload<any>}` and they are [most.js](https://npmjs.com/packages/most) streams which can be composed together to create more complex inputs.

See the [examples](https://github.com/mattstyles/raid/tree/master/packages/examples/examples) for more detailed usage.

## Streams

Each collection of input streams typically exports a stream that can be consumed and an enum of actions that may be emitted.

* [Keys](#keys)
* [Tick](#tick)
* [Screen](#screen)

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
import { keys, actions } from '@raid/streams/keys'
import { Signal } from 'raid'

const signal = new Signal({key: ''})

// Mount the keystream to the signal
signal.mount(keys())

// Respond to key events
signal.register((state, { type, payload }) => {
  if (type === actions.keydown) {
    state.key = payload.key
  } else {
    state.key = ''
  }
  return state
})
```

### keydown

`<Function <Map, Object>> => <Object>`

Keydown attaches to keydown events.

```js
{
  <Map> keys [required],
  <?Object> options: {
    <?HTMLDomElement> el: window,
    <?String> type: actions.keydown,
    <?Array<String>> exclude: excludeList
  }
}

signal.mount(keydown(new Map(), {
  el: window
}))
```

`type` can be used to specify the event type which this stream produces. `exclude` is a list of [vkey](https://www.npmjs.com/package/vkey) definitions to ignore when they fire.

Keydown fires on initial keydown event when pressing a key and emits an event of the type:

```js
{
  <String> key,
  <Map> keys,
  <HTMLDomEvent> event
}
```

```js
import { keydown, actions } from '@raid/streams/keys'

signal.mount(keydown(new Map()))

signal.register((state, event) => {
  if (event.type === actions.keydown) {
    state.key = event.payload.key
  }
  return state
})
```

### keyup

`<Function <Map, Object>> => <Object>`

Keyup attaches to keyup events.

```js
{
  <Map> keys [required],
  <?Object> options: {
    <?HTMLDomElement> el: window,
    <?String> type: actions.keyup,
    <?Array<String>> exclude: excludeList
  }
}

signal.mount(keyup(new Map(), {
  el: window
}))
```

`type` can be used to specify the event type which this stream produces. `exclude` is a list of [vkey](https://www.npmjs.com/package/vkey) definitions to ignore when they fire.

Keyup fires when a key is released and emits an event of the type:

```js
{
  <String> key,
  <Map> keys,
  <HTMLDomEvent> event
}
```

```js
import { keyup, actions } from '@raid/streams/keys'

signal.mount(keyup(new Map(), {
  el: window
}))

signal.register((state, { type, payload }) => {
  if (type === actions.keyup) {
    state.key = payload.key
  }
  return state
})
```

### keys

Keys is a stream that emits keydown, keyup and keypress events. The keypress event fires when a key is pressed at an interval equalling `requestAnimationFrame`.

`keys` accepts a few parameters; the keymap to use can be shared with other streams and passed in, similarly, an element to attach to can specified. The `rate` parameter defines how frequently the `keypress` event will fire.

Like all other streams, the event type can be specified, however, as `keys` emits 3 different action types the `type` parameter is prefixed with `:up`, `:press`, and `:down` to produce the action types emitted from this stream.

The event signature for keyup and keydown matches the underlying key streams they come from, the keypress event signature is slightly simpler as its only concern is that _something_ has been pressed:

```js
{
  <?Map> keys: null,
  <?Number> rate: 0,
  <?HTMLDomElement> el: window,
  <?String> type: '@@keys'
}
```

The key map holds how long a key has been pressed for mapped against its [vkey](https://www.npmjs.com/package/vkey) definition.

```js
import { keys, actions } from '@raid/streams/keys'

signal.mount(keys())

signal.register((state, { type, payload }) => {
  if (type === actions.keydown) {
    state.key = payload.key
  }

  if (type === actions.keyup) {
    state.key = ''
  }

  if (type === actions.keypress) {
    if (payload.keys.has('<enter>')) {
      // Grab the delta of the keypress from the key map
      state.heldDownFor = payload.keys.get('<enter>')
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
  <?Number> length: 10,
  <?Map> keys: null,
  <?String> type: actions.sequence
}

signal.mount(keySequence({
  length: 10
}))
```

The event signature looks like:

```js
{
  <Array <String>> keys
}
```

The returned strings reference [vkey](https://www.npmjs.com/package/vkey) definitions.

```js
import { keySequence, actions } from '@raid/streams/keys'

signal.mount(keySequence())

signal.register((state, { type, payload }) => {
  if (type === actions.sequence) {
    state.sequence = payload.keys
  }

  return state
})
```

### timedKeySequence

timedKeySequence keeps track of the last `x` keydown events from the last `y` ms.

The options object looks like:

```js
{
  <?Number> length: 10,
  <?Map> keys: null,
  <?Number> timeout: 200,
  <?String> type: actions.timedSequence
}

signal.mount(timedKeySequence({
  length: Number.MAX_SAFE_INTEGER,
  timeout: 300
}))
```

The event signature looks like:

```js
{
  <Array <String>> keys
}
```

The returned strings reference [vkey](https://www.npmjs.com/package/vkey) definitions.

```js
import { timedKeySequence, actions } from '@raid/streams/keys'

signal.mount(timedKeySequence())

signal.register((state, { type, payload }) => {
  if (type === actions.timedSequence) {
    state.sequence = payload.keys
  }

  return state
})
```

## Tick

### Actions

* `tick` Emitted each frame.

### Tick

Tick stream maps `requestAnimationFrame` into a stream that emits a frame delta each frame increment.

By default it attaches to the `window` but this can be configured:

```js
{
  <?HTMLDomElement> el: window,
  <?String> type: actions.tick
}

signal.mount(tick({
  el: document.querySelector('.js-gl')
}))
```

The event signature looks like this and contains the duration of the last frame:

```js
{
  <Number> dt
}
```

```js
import { tick, actions } from '@raid/streams/tick'

signal.mount(tick())

signal.register((state, { type, payload }) => {
  if (type === actions.tick) {
    state.lastElapsed = payload.dt
  }

  return state
})
```

## Screen

Screen streams manage common screen events that the browser might emit, screen emits separate streams for each event or a merged stream.

```js
import { screen, actions } from '@raid/streams/screen'

signal.mount(screen())

signal.register((state, { type, payload }) => {
  if (type === actions.orientation) {
    state.orientation = payload.orientation
  }
  return state
})
```

### Actions

* `resize` Debounced resize event with new dimensions.
* `scroll` Scroll event with new position.
* `orientation` Emitted on the `orientationchange` event.

### resize

resize triggers whenever the window changes its size and emits the new dimensions.

Options object looks like:

```js
{
  <?Number> debounce: 100,
  <?String> type: actions.resize
}

signal.mount(resize({
  debounce: 50
}))
```

Event signature looks like:

```js
{
  <HTMLDomEvent> raw,
  <Number> width,
  <Number> height,
  <Number> timeStamp
}
```

```js
import { resize, actions } from '@raid/streams/screen'

signal.mount(resize())

signal.register((state, { type, payload: { width, height } }) => {
  if (type === actions.resize) {
    state.dimensions = [width, height]
  }
  return state
})
```

### scroll

`scroll` triggers whenever the window is scrolled and emits the new scroll position.

```js
{
  <?String> type: actions.scroll
}
```

```js
signal.mount(scroll())
```

Event signature looks like:

```js
{
  <HTMLDomEvent> raw,
  <Number> left,
  <Number> top,
  <Number> timeStamp
}
```

```js
import { scroll, actions } from '@raid/streams/screen'

signal.mount(scroll())

signal.register((state, { type, payload: { left, top } }) => {
  if (type === actions.scroll) {
    state.scrollPosition = [left, top]
  }
  return state
})
```

### orientation

orientation triggers whenever the window `orientationchange` event is triggered.


```js
{
  <?String> type: actions.orientation
}
```

```js
signal.mount(orientation())
```

Event signature looks like:

```js
{
  <HTMLDomEvent> raw,
  <Number> angle,
  <Number> orientation,
  <Number> timeStamp
}
```

```js
import { orientation, actions } from '@raid/streams/screen'

signal.mount(orientation())

signal.register((state, { type, payload }) => {
  if (type === actions.orientation) {
    state.orientation = payload.orientation
  }
  return state
})
```

## Stand-alone streams

All these action streams are just regular [most.js](https://npmjs.com/packages/most) streams and can be consumed as normal, there is no restriction to use them with Raid. The only tie they have to Raid is that they emit `{type, payload}` objects. As they are regular streams all the regular stream functions work.

```js
import { keys, actions } from '@raid/streams/keys'

keystream
  .map(event => ({
    ...event,
    meta: '@@foo'
  }))
  .observe(({ type, payload, meta }) => {
    if (type === actions.keydown) {
      console.log(`Pressing ${payload.key}, meta: ${meta}`)
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
