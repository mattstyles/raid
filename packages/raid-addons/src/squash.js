
import forceArray from 'force-array'

export const squash = key => updates => (state, event) => {
  if (event.type !== key) {
    return state
  }
  return forceArray(updates)
    .reduce((state, fn) => fn(state, event.payload), state)
}
