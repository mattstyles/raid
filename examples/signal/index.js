
import React from 'react'
import { render } from 'react-dom'

import element from '../_common/element'
import state from './state'
import { Counter } from './counter'

const styles = {}

styles.app = {
  container: {
    display: 'flex'
  },
  left: {
    flex: .5,
    padding: '1em'
  },
  right: {
    flex: .5,
    minHeight: '100vh',
    borderLeft: '1px solid rgb( 232, 232, 232)',
    background: 'rgb( 40, 40, 40 )',
    padding: '1em'
  },
  controls: {
    marginBottom: '1em'
  },
  code: {
    fontFamily: 'Source Code Pro, consolas, monospace',
    fontSize: 15,
    color: 'rgb( 244, 246, 252 )',
    margin: 0
  }
}

const App = props => {
  return (
    <div style={ styles.app.container} >
      <div style={ styles.app.left }>
        <Counter />
      </div>
      <div style={ styles.app.right }>
        <pre style={ styles.app.code }>
          { JSON.stringify( state.get().toJSON(), null, '  ' ) }
        </pre>
      </div>
    </div>
  )
}


/**
 * Main app render function
 */
function main( appstate ) {
  render( <App state={ appstate.get( 'app' ) } />, element )
}

/**
 * Attach listener to re-render on state changes and start the state machine
 */
state
  .on( 'update', main )
  .start()
