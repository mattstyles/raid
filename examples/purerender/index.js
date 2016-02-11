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


/**
 * Main app render function
 */
function render( appstate ) {
  perf.start()
  ReactDOM.render( <App state={ appstate.reference( 'root' ) } />, element )
  perf.stop()

  perf.printWasted()
}

/**
 * Attach listener to re-render on state changes
 */
state
  .on( 'update', render )
  .start()
