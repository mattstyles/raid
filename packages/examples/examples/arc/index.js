
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { render } from 'react-dom'

import {
  compress,
  debug
} from '@raid/addons'
import { element, App } from '../_common'

import { signal } from './store'
import { Main } from './main'
import { request } from './effects'
import { actions } from './actions'

const onRequestPending = (state, payload) => {
  return {
    ...state,
    isRequesting: true,
    user: null,
    err: null
  }
}

const onRequestSuccess = (state, user) => {
  return {
    ...state,
    isRequesting: false,
    user
  }
}

const onRequestFailure = (state, err) => {
  return {
    ...state,
    isRequesting: false,
    user: null,
    err
  }
}

// Register updaters
signal.register(compress({
  [actions.requestPending]: onRequestPending,
  [actions.requestSuccess]: onRequestSuccess,
  [actions.requestFailure]: onRequestFailure
}))

// Debug
signal.register(debug('>>'))

// Register arc
signal.register(request)

signal.observe(state => {
  render(
    <App state={state}>
      <Main {...state} />
    </App>,
    element
  )
}, e => console.error(e))
