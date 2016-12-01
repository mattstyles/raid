
# Getting Started

Raid enforces top-down rendering through update events emitted from the state tree when mutations occur and the state tree is recreated. As such, in hinges around its state tree implementation.

```js
import { State } from 'raid'

const state = new State()
```

We’ll only add complexity when there is no other choice so creating just one state tree and using that for the entire state of our application means that we only have one place to listen to for changes. We respond to any change in the state tree by triggering a top-level render.

```js
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { State } from 'raid'

const state = new State()

const App = props => {
  return (
    <h1>Hello Raid</h1>
  )
}

function render( appState ) {
  ReactDOM.render( <App />, document.getElementById( 'main' ) )
}

state
  .on( 'update', render )
  .start()
```

We create our state tree and then listen for `update` events, which trigger a re-render and pass the state object to the callback, in this case, `render`.

The `render` function calls on React to do the heavy lifting and renders our application.

The call to `.start()` simply triggers an `update` event which forces our application to do an initial render. The same could be achieved by manually calling `render()` and explicitly passing the state, `render( state )`.

## Next Steps

In this case we have no data, so let’s create an [initial state](initial-state.html) for our data and start re-rendering on updates.
