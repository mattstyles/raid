
import {safe, compress} from 'raid-addons'

import {actions} from './actions'
import {getHistory} from './history'
import {getRouteIndex, getCurrentRoute} from './utils'

export const DEFAULT_KEY = 'navigation'

/**
 * Initial state root
 */
const initialState = {
  stack: [getCurrentRoute()],
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
 * Popper
 */
const pop = (key, get, state, location) => {
  const {index, stack} = get(state)
  let routeIndex = getRouteIndex(stack, location)

  // If the route was found then use it
  if (routeIndex >= 0) {
    state[key].index = routeIndex
    return
  }

  if (index === 0) {
    state[key].stack.unshift(getCurrentRoute())
    return
  }

  if (index === stack.length - 1) {
    console.warn('Attempting to navigate forward but no route exists')
  }
}

/**
 * pusher
 */
const push = (key, get, state, location) => {
  const {index, stack} = get(state)

  // If we're pushing in to the middle next nuke end of stack
  if (index < stack.length - 1) {
    state[key].stack = stack.slice(0, index + 1)
  }

  state[key].index = index + 1
  state[key].stack.push(getCurrentRoute())
}

/**
 * Updates the state based on a navigation pop event
 */
const createUpdatePop = (key, history) => {
  const get = selector(key)
  return safe((state, payload) => {
    return pop(key, get, state, payload.location)
  })
}

/**
 * Updates the state based on a navigation push event
 */
const createUpdatePush = (key, history) => {
  const get = selector(key)
  return safe((state, payload) => {
    return push(key, get, state, payload.location)
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
    [actions.pop]: createUpdatePop(key, history),
    [actions.push]: createUpdatePush(key, history)
  })
}

/**
 * Update function to register with raid
 */
export const update = createUpdate(DEFAULT_KEY)
