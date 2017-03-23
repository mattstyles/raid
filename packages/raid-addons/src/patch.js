
// Provides selected key to update and applies back to state
const select = (key, update) => (state, event) => ({
  ...state,
  [key]: update(state[key], event)
})

// Returns a function accepting an update
const createPatch = key => update => select(key, update)

// Allow fixed arity for easier composition
const patch = (key, update) => {
  if (!key) {
    throw new Error('[raid:patch] key must be supplied')
  }

  if (!update || typeof update !== 'function') {
    return createPatch(key)
  }

  return select(key, update)
}

export default patch
