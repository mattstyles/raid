
# Responding to Changes

Interesting applications generally have multiples states, let’s work out how to create changes and have them reflected in our UI.

```js
import { State } from 'raid'

const state = new State({
  foo: 'foo'
})

const onClick = event => {
  state.cursor([ 'root', 'foo' ]).update( cursor => 'baz' )
}

const App = props => {
  return (
    <div>
      <h1>Value: { props.state.get( 'foo' ) }</h1>
      <button onClick={ onClick }>Click me</button>
    </div>
  )
}

function render( appState ) {
  ReactDOM.render( <App state={ appState.get( 'root' ) } />,
  document.getElementById( 'main' ) )
}

state
  .on( 'update', render )
  .start()
```
