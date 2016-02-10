# immreact

> Centralised immutable data structure designed for use with React

_Standing on the shoulders of the [immstruct](https://github.com/omniscientjs/immstruct) and  [immutable](https://github.com/facebook/immutable-js/) teams._


## Getting Started

```sh
npm i -S immreact
```

To use the library, include it and then create an instance of a state structure

```js
import Immreact from 'immreact'

let state = new Immreact.State()
```

Immreact enforces top-down rendering through update events emitted by the state tree when mutations occur, but the choice of how to structure your app is still in your hands.


## Example with stateless components

Presentational and business logic can be entirely decoupled by use of the state dispatcher. The dispatcher used is the same one from [Flux](https://github.com/facebook/flux) and responses occur by registering callbacks.

```js
import Immreact from 'immreact'

let state = new Immreact.State()

state.register( dispatch => {
  // Respond to dispatches and perform actions
})

const App = props => {
  return (
    <button
      onClick={ event => {
        state.dispatch({
          type: 'dispatchedEventType',
          payload: { ... }
        })
      }}
    >Click me</button>
  )
}
```

This pattern scales well and allows action objects to attach callbacks to the state tree which respond to dispatches triggered from your UI.

`Immreact.State` exposes two methods for accessing the state tree, `cursor` and `get`. Both methods have the same signature which accepts an array of strings describing a key path to access the tree and return either a cursor to the data or a read-only reference.

Presentational components should be passed references to the data in order to render themselves whilst the application logic should access cursors to allow data updates to occur.

```js
import Immreact from 'immreact'
import React from 'react'
import ReactDOM from 'react-dom'

// Set up the initial state of the application
let state = new Immreact.State( 'app', {
  count: 0
})

state.register( dispatch => {
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
          state.dispatch({
            type: 'incrementCounter'
          })
        }}
      >Increment</button>
    </div>
  )
}

// Pass only references to the presentational components
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

Cursors can be passed directly to components to simulate internal component state. They can be passed down the render tree to children or grabbed directly from the state object by using a key path.

```js
import Immreact from 'immreact'
import React from 'react'
import ReactDOM from 'react-dom'

let state = new Immreact.State( 'app', {
  count: 0
})

const App = props => {
  return (
    <div>
      <h1>Counter <span>{ props.state.get( 'count' ) }</span></h1>
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
  ReactDOM.render( <App state={ appstate.cursor( 'app' ) } />, document.body )
}

state
  .on( 'update', render )
  .start()
```


## Running the examples

Once you’ve cloned and installed all the dependencies you use can use npm to spawn a server to show some example usage of immreact

```
npm start -- -o
```

The examples server will watch for changes to the library and reload so feel free to also fire the watch script and hack on the code too

```
npm run watch
```


## Contributing

PR’s are welcome, feel free to open an issue first to discuss if necessary.

In lieu of a formal styleguide please try to follow the style of the existing, create new tests for all new functionality and ensure all tests are passing.

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
npm install --save immreact
```

## License

ISC
