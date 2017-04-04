
import createHistory from 'history/createBrowserHistory'

import {actions, dispatcher} from './actions'

var histories = {}

const create = (fn = createHistory, key) => {
  console.log('creating history')
  const history = fn()
  histories[key] = history
  window.hist = history
  return history
}

export const history = (fn, key = 'browser') => {
  return histories[key] || create(fn, key)
}

export const listener = (signal, hist = history()) => {
  const dispatch = dispatcher(signal, actions.navigate)
  return (location, action) => {
    if (action === 'POP') {
      console.log('I can hear you...')
      dispatch({
        route: location.pathname,
        state: hist.state
      })
    }
  }
}
