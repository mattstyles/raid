
import { createBrowserHistory } from 'history'

import { actions, dispatcher } from './actions'

var defaultHistory = null

const create = () => {
  defaultHistory = createBrowserHistory()
  return defaultHistory
}

export const getHistory = (history) => {
  return history || defaultHistory || create()
}

export const createListener = signal => {
  const pop = dispatcher(signal, actions.pop)
  const push = dispatcher(signal, actions.push)

  return ({ location, action }) => {
    if (action === 'POP') {
      pop({ location })
    }

    if (action === 'PUSH') {
      push({ location })
    }
  }
}
