
import {actions} from './actions'
import {safe, compress} from 'raid-addons'

export const DEFAULT_KEY = 'navigation'

/**
 * Initial state root
 */
const initialState = {
  stack: [window.location.pathname],
  index: 0
}

export const setInitial = key => ({
  [key]: initialState
})

export const initial = setInitial(DEFAULT_KEY)

/**
 * Get state root selector function
 */
export const selector = key => state => state[key]

/**
 * Updates the state based on a navigation event
 */
const updateNavigate = key => {
  const get = selector(key)
  return safe((state, payload) => {
    const {index, stack} = get(state)
    stack[index] = payload.route
  })
}

/**
 * Can be used to create an update function that refs a defined root
 */
export const createUpdate = key => {
  return compress({
    [actions.navigate]: updateNavigate(key)
  })
}

/**
 * Update function to register with raid
 */
export const update = createUpdate(DEFAULT_KEY)
