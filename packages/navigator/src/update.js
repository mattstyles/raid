
import { safe, compress } from 'raid-addons'
import { isNull } from 'lodash/fp'

import { actions } from './actions'
import { getHistory } from './history'
import { getRouteIndex, getCurrentRoute } from './utils'

export const DEFAULT_KEY = 'navigation'

const getStorage = storage => {
  return isNull(storage)
    ? null
    : storage || (window && window.sessionStorage)
}

/**
 * Initial state root
 */
const getInitialState = (storage, history) => {
  const initial = {
    stack: [getCurrentRoute(null, history)],
    index: 0
  }

  if (!storage) {
    return initial
  }

  try {
    const stored = storage.getItem(DEFAULT_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (err) {
    return initial
  }

  return initial
}

// const initialState = (storage, history) =>

export const setInitial = ({ key, storage, history }) => {
  storage = getStorage(storage)
  key = key || DEFAULT_KEY

  return {
    [key]: getInitialState(storage, history)
  }
}

export const initial = setInitial({
  key: DEFAULT_KEY
})

/**
 * Get state root selector function
 */
export const selector = (key = DEFAULT_KEY) => state => state[key]

/**
 * Popper
 */
const pop = ({ key, get, state, location, history }) => {
  const { index, stack } = get(state)
  const routeIndex = getRouteIndex(location, stack)

  // If the route was found then use it
  if (routeIndex >= 0) {
    state[key].index = routeIndex
    return
  }

  if (index === 0) {
    state[key].stack.unshift(getCurrentRoute(location))
    return
  }

  if (index === stack.length - 1) {
    console.warn('Attempting to navigate forward but no route exists')
  }
}

/**
 * pusher
 */
const push = ({ key, get, state, location, history }) => {
  const { index, stack } = get(state)

  // If we're pushing in to the middle next nuke end of stack
  if (index < stack.length - 1) {
    state[key].stack = stack.slice(0, index + 1)
  }

  state[key].index = index + 1
  state[key].stack.push(getCurrentRoute(location))
}

/**
 * Storage
 */
const save = ({ storage, key, state, get }) => {
  if (!storage) {
    return
  }

  storage.setItem(key, JSON.stringify(get(state)))
}

/**
 * Setup
 */
const init = ({ state, storage, history, key, get }) => {
  return {
    ...state,
    ...setInitial({ key, storage, history })
  }
}

/**
 * Updates the state based on a navigation pop event
 */
const createUpdatePop = ({ key, history, storage }) => {
  const get = selector(key)
  return safe((state, payload) => {
    pop({ key, get, state, location: payload.location, history })
    save({ storage, key, get, state })
  })
}

/**
 * Updates the state based on a navigation push event
 */
const createUpdatePush = ({ key, history, storage }) => {
  const get = selector(key)
  return safe((state, payload) => {
    push({ key, get, state, location: payload.location, history })
    save({ storage, key, get, state })
  })
}

const createInit = ({ key, storage, history }) => {
  const get = selector(key)
  return safe((state, payload) => {
    return init({ key, storage, history, state, get })
  })
}

/**
 * Can be used to create an update function that refs a defined root and
 * can be supplied with a specific history instance
 */
export const createUpdate = ({ key, history, storage }) => {
  key = key || DEFAULT_KEY
  history = getHistory(history)
  storage = getStorage(storage)
  return compress({
    [actions.pop]: createUpdatePop({ key, history, storage }),
    [actions.push]: createUpdatePush({ key, history, storage }),
    [actions.init]: createInit({ key, history, storage })
  })
}

/**
 * Update function to register with raid
 */
export const update = createUpdate({
  key: DEFAULT_KEY
})
