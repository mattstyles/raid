
import React from 'react'
import state from './state'

const style = {
  fontFamily: 'Source Code Pro, consolas, monospace',
  fontSize: 15,
  color: 'rgb( 244, 246, 252 )',
  margin: 0
}

export default props => {
  return (
    <pre style={ style }>
      { JSON.stringify( state.get().toJSON(), null, '  ' ) }
    </pre>
  )
}
