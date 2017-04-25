
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

export const createListener = signal => {
  const pop = dispatcher(signal, actions.pop)
  const push = dispatcher(signal, actions.push)

  return (location, action) => {
    console.log('history action', action, location)
    if (action === 'POP') {
      pop({location})
    }

    if (action === 'PUSH') {
      push({location})
    }
  }
}
