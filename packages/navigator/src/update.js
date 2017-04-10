
import {safe, compress} from 'raid-addons'

import {actions} from './actions'
import {getHistory} from './history'

export const DEFAULT_KEY = 'navigation'

/**
 * Initial state root
 */
const initialState = {
  stack: [{
    pathname: window.location.pathname,
    key: window.history.state.key,
    state: window.history.state.state
  }],
  index: 0
}

export const setInitial = key => ({
  [key]: initialState
})

export const initial = setInitial(DEFAULT_KEY)

/**
 * Get state root selector function
 */
export const selector = (key = DEFAULT_KEY) => state => state[key]

/**
 * Updates the state based on a navigation event
 */
const createUpdateNavigate = (key, history) => {
  const get = selector(key)
  return safe((state, payload) => {
    const {index, stack} = get(state)
    stack[index] = payload.location
  })
}

/**
 * Can be used to create an update function that refs a defined root and
 * can be supplied with a specific history instance
 */
export const createUpdate = (key, history) => {
  key = key || DEFAULT_KEY
  history = getHistory(history)
  return compress({
    [actions.navigate]: createUpdateNavigate(key, history)
  })
}

/**
 * Update function to register with raid
 */
export const update = createUpdate(DEFAULT_KEY)
