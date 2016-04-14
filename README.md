# Raid

> Centralised immutable data structure designed for use with React

[![npm](https://img.shields.io/npm/v/raid.svg?style=flat)](https://www.npmjs.com/package/raid)
[![License](https://img.shields.io/npm/l/raid.svg)](https://www.npmjs.com/package/raid)

## Getting Started

```sh
npm i -S raid
```

To use the library, include it and then create an instance of a state structure

```js
import Raid from 'raid'

let state = new Raid.State()
```

Raid enforces top-down rendering through update events emitted by the state tree when mutations occur, but the choice of how to structure your app is still in your hands.

Decoupling logic from stateless components is a supported pattern, but if there was a requirement to attach some logic to your components then that way of structuring becomes possible using reference cursors to extract only those parts of the state tree that are required by a component.

## Example with stateless components

Presentational and business logic can be entirely decoupled by use of the state dispatcher. The dispatcher used here is from [Flux](https://github.com/facebook/flux) and responses occur by registering callbacks.

```js
import { State } from 'raid'
import { Dispatcher } from 'flux'

let state = new State()
let dispatcher = new Dispatcher()

dispatcher.register( dispatch => {
  // Respond to dispatches and perform actions
})

const App = props => {
  return (
    <button
      onClick={ event => {
        dispatcher.dispatch({
          type: 'dispatchedEventType',
          payload: { ... }
        })
      }}
    >Click me</button>
  )
}
```

This pattern scales well and allows action objects to attach callbacks to the state tree which respond to dispatches triggered from your UI.

`Raid.State` exposes three methods for accessing the state tree, `cursor`, `get` and `reference`. All methods have the same signature which accepts an array of strings describing a key path to access the tree and return either a cursor to the data or a read-only instance of an unwrapped cursor. This equates to either a cursor which can be updated or the data itself.

Presentational components should be passed dereferenced data in order to render themselves whilst the application logic should access cursors to allow data updates to occur.

```js
import { State } from 'raid'
import React from 'react'
import ReactDOM from 'react-dom'
import { Dispatcher } from 'flux'

// Set up the initial state of the application
let state = new State( 'app', {
  count: 0
})

let dispatcher = new Dispatcher()

dispatcher.register( dispatch => {
  if ( dispatch.type === 'incrementCounter' ) {
    state.cursor([ 'app', 'count' ]).update( cursor => ++cursor )
    return
  }
})

const App = props => {
  return (
    <div>
      <h1>Counter <span>{ props.state.get( 'count' ) }</span></h1>
      <button
        onClick={ event => {
          dispatcher.dispatch({
            type: 'incrementCounter'
          })
        }}
      >Increment</button>
    </div>
  )
}

// Pass only dereferenced data to the presentational components
// `State.get` will also accept a string for top-level structures
function render( appstate ) {
  ReactDOM.render( <App state={ appstate.get( 'app' ) } />, document.body )
}

// Re-render on update events
// Update event pass the state tree to the update callback
// 'State.start' simply fires an update to render the initial application state
state
  .on( 'update', render )
  .start()
```

## Example with stateful-like components

Cursors or references can be passed directly to components to simulate internal component state. Passing references means that child components must grab their own cursors but cursors from references will be fresh. They can be passed down the render tree to children or grabbed directly from the state object by using a key path.

```js
import { State } from 'raid'
import React from 'react'
import ReactDOM from 'react-dom'

let state = new State( 'app', {
  count: 0
})

const App = props => {
  return (
    <div>
      <h1>Counter <span>{ props.state.cursor( 'count' ).deref() }</span></h1>
      <button
        onClick={ event => {
          props.state.cursor( 'count' ).update( cursor => ++cursor )
        }}
      >Increment</button>
    </div>
  )
}

// Pass a cursor in to the stateful-like components
function render( appstate ) {
  ReactDOM.render( <App state={ appstate.reference( 'app' ) } />, document.body )
}

state
  .on( 'update', render )
  .start()
```

## Signals

Raid also exposes the concept of signals, which act in a similar fashion to the dispatchers shown in the examples above but also abstract the model they operate on.

Signals help to enforce a `Model -> Action -> Update -> Render` pattern.

See [the signal example](https://github.com/mattstyles/raid/tree/master/examples/signal) for a full overview of using signals.

## Enhanced State Components

For use with React, Raid also exposes a component enhancer which wraps components in such a way so that the wrapped component always receives a fresh cursor to the data that it manipulates.

This allows components to have the illusion of their own state when in reality their state is passed to them as props, meaning that `shouldComponentUpdate` can simply shallow compare props for changes and thus leverage the performance gains that can be apparent when using a [pure functional components](https://facebook.github.io/react/docs/pure-render-mixin.html).


## Running the examples

Once you’ve cloned and installed all the dependencies you use can use npm to spawn a server to show some example usage of raid

```
npm start -- -o
```

The examples server will watch for changes to the library and reload so feel free to also fire the watch script and hack on the code too

```
npm run watch
```


## Contributing

PR’s are welcome, feel free to open an issue first to discuss if necessary.

In lieu of a formal styleguide please try to follow the style of the existing codebase, create new tests for all new functionality and ensure all tests are passing.

To build the project use

```
npm run build
```

There is also a watch script

```
npm run watch
```

If you’re running the examples server then that will listen for changes to the code and reload, use the following commands to fire up the examples server and the watch task

```
npm start
npm run watch
```


## Install

Using [npm](https://www.npmjs.com/),

```sh
npm install --save raid
```

## License

ISC
