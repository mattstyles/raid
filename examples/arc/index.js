
import 'babel-polyfill'
import {render} from 'react-dom'

import {
  compress,
  safe
} from 'raid-addons/src'
import {element, App} from '../_common'

import {signal} from './store'
import {Main} from './user'
import {request} from './effects'
import {actions} from './actions'

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
signal.register(safe((state, event) => {
  console.log('-- signal --', state, event)
}))

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
