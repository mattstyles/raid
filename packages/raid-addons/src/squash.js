
import forceArray from 'force-array'

const squash = key => updates => (state, event) => {
  if (event.type !== key) {
    return state
  }
  return forceArray(updates)
    .reduce((fn, state) => fn(state, event.payload), state)
}

export default squash
