
import createHistory from 'history/createBrowserHistory'

import {actions, dispatcher} from './actions'

var defaultHistory = null

const create = () => {
  defaultHistory = createHistory()
  return defaultHistory
}

export const getHistory = (history) => {
  return history || defaultHistory || create()
}

export const createListener = (signal, history) => {
  const dispatch = dispatcher(signal, actions.navigate)
  return (location, action) => {
    if (action === 'POP') {
      console.log('I can hear you...', location)
      dispatch({
        location
      })
    }
  }
}
