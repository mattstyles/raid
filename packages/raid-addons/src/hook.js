
import {
  isFn,
  check
} from './utils'

/**
 * Creates a hook that runs on every emit and matches on an event
 * type predicate
 */
const hook = (fn, opts = {}) => {
  let predicate = opts.predicate || null
  let match = check(predicate)
  return (state, event) => {
    let type = typeof event === 'string' || isFn(predicate)
      ? event
      : event.type
    return match(type)
      ? fn(state, event)
      : state
  }
}

export default hook
