# immreact

> Centralised immutable data structure for use with React and Flux

Made possible by the great work by the [immstruct](https://github.com/omniscientjs/immstruct) team.

## Getting Started

```sh
npm i -S immreact
```

To use the library, include it and then create an instance of a state structure

```js
import Immreact from 'immreact'

let state = new Immreact.State()
```

## Example

The state object created by invoking the `Immreact.State` constructor provides a way to access a single data structure and then pass cursors to that data down through an application. Each mutation triggers an `update` event which can then be used to redraw the application from the top-down.

Create the structure to hold the application data.

```js
import Immreact from 'immreact'
import React from 'react'
import ReactDOM from 'react-dom'

// Create the state structure
let state = new Immreact.State( 'app', {
    count: 0
})
```

Then set up a single render point and have it render whenever the data changes.

```js
function render() {
    <App state={ state.cursor( 'app' ) } />
}

state.on( 'update', render )
```

Now the `<App>` component has access to the `app` structure and can pass data down to its children via props. Any mutations to the data will trigger a render event, whereby `React` will work out the diffs and render only what has changed.

```js
// Elsewhere in the application
state.cursor([ 'app', 'count' ]).update( cursor => {
    return ++cursor
})
```

See the `examples` folder for a slightly more involved use-case.

## Passing properties to children

Whilst there are ways to circumvent passing props to children, such as using `state.create` to create a new namespace or accessing `state.cursor( 'app' )` from children, many applications can gain a performance boost by using a pure render function which relies on children only receiving data from their parents.

## Saving and loading centralised state

By using one centralised state object and cursors to subtress within that data saving and loading becomes trivial, there are even helpers to make life super-easy. Try saving the entire state of your app when an error occurs and having the error instantly reproducible, tres cool.

```js
localStorage.setItem( 'state', state.save() )

state.load( localStorage.setItem( 'state' ) )
```

## Contributing

This project is still young and subject to change and additions, components that automatically hook into the centralised state aren’t even fully implemented yet!

PR’s are welcome, feel free to open an issue first to discuss.

In lieu of a formal styleguide please try to follow the style of the existing, create new tests for all new functionality and ensure all tests are passing.

The source requires a babel transform to make it work everywhere you might want to use it, use

```
npm run build
```

to prepare your code for an ES5 environment.

## License

ISC
