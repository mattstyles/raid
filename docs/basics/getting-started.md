
# Getting Started

Raid enforces top-down rendering through update events emitted from the state tree when mutations occur and the state tree is recreated. Raid uses the term `signal` to refer to a stream that emits update events with a new data tree.

```js
import {Signal} from 'raid'

const signal = new Signal()
```

We’ll only add complexity when there is no other choice so creating just one state tree and using that for the entire state of our application means that we only have one place to listen to for changes.

## Observing state changes

We can respond to any change in the state tree by observing the signal and triggering a top-level render.

```js
import React from 'react'
import {render} from 'react-dom'
import {Signal} from 'raid'

const signal = new Signal({})

const App = props => {
  return (
    <h1>Hello Raid</h1>
  )
}

signal.observe(state => {
  render(
    <App />,
    document.getElementById('main')
  )
})
```

We have created our state tree by creating a new signal and passed in an initial state for our application, in this case an empty object. We then listen for changes to that state by observing the signal, triggering a top-down render of our application.

## Passing state through our application

From this start we can pass our application state through our components via their properties.

```js
import React from 'react'
import {render} from 'react-dom'
import {Signal} from 'raid'

const signal = new Signal({
  name: 'Joe'
})

const Message = ({name}) => <h2>{`Hello ${name}`}</h2>
const App = ({state}) => <Message name={state.name} />

signal.observe(state => {
  render(
    <App state={state}/>,
    document.getElementById('main')
  )
})
```

## Updating the state

The next part of the puzzle is to separate our presentational logic from our business logic by moving our update functions into their own sphere of influence. This helps encapsulate each section of our application and allows us to reason more easily about data flow and state changes during the lifetime of our application.

```js
import React from 'react'
import {render} from 'react-dom'
import {Signal} from 'raid'

const signal = new Signal({
  name: 'Joe'
})

const Message = ({name}) => <h2>{`Hello ${name}`}</h2>
const App = ({state}) => <Message name={state.name} />

const update = (state, event) => {
  if (event.type === 'CHANGE_NAME') {
    state.name = event.payload.name
    return state
  }

  return state
}

signal.register(update)

signal.observe(state => {
  render(
    <App state={state}/>,
    document.getElementById('main')
  )
})
```

Update functions require two parameters, the `state` they operate against and the `event` that they will query to see if they should perform any update. An application can have any number of update functions, feel free to use as many as you need, keeping each update function small is usually a good way to go but group functionality as you see fit.

All paths out of an update function should return some sort of state, usually adding `return state` to any control path is enough to ensure the old state is propagated when no updates have occurred.

Updates must be registered with the signal so that the signal knows to route action events through the update functions before emitting a new state tree based on the output of those updates.

The final piece of the puzzle is to start emitting action events.

## Emitting actions

```js
import React from 'react'
import {render} from 'react-dom'
import {Signal} from 'raid'

const signal = new Signal({
  name: 'Joe'
})

const Message = ({name}) => <h2>{`Hello ${name}`}</h2>
const App = ({state}) => <Message name={state.name} />

const update = (state, event) => {
  if (event.type === 'CHANGE_NAME') {
    state.name = event.payload.name
    return state
  }

  return state
}

signal.register(update)

signal.observe(state => {
  render(
    <App state={state}/>,
    document.getElementById('main')
  )
})

setTimeout(() => {
  signal.emit({
    type: 'CHANGE_NAME',
    payload: {
      name: 'Josie'
    }
  })
}, 3000)
```

Actions are represented as plain objects, by convention the example above shows an object with `type` and `payload` members, but there is no enforcement here, use whatever structure makes sense for your application.

In this example an action event is triggered after 3 seconds, which propagates through the single update function, causing a mutation to the application state, which then gets emitted from the signal stream, whereby the application can respond to the change and trigger a re-render.

The flow of data through the application always remains consistent:

```
Intent => Consequence
```

This simple flow usually consists of three parts:

```
Action => Update => Render
```

These three steps are clearly modelled within a `signal` via the `emit`, `register` and `observe` methods which allow this life cycle to play out in our application.
