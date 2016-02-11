/**
 * Example using the component pure render function
 */


import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import perf from 'react-addons-perf'
import { Enhance } from '../../lib'

import element from '../_common/element'
import ActionButton from '../_common/actionButton'
import state from './state'
import store from './store'
import App from './app'

window.state = state

/**
 * Main app render function
 */
function render( appstate ) {
  perf.start()

  // Note that we're passing only a deref here through to components, if we needed
  // to we could pass references but they are slower, nearly twice as slow.
  ReactDOM.render( <App state={ appstate.get([ 'root', 'users' ]) } />, element )
  perf.stop()

  perf.printWasted()
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
