import { check, isFn } from './utils'

/**
 * Creates a hook that runs on every emit and matches on an event
 * type predicate
 */
export const hook = (fn, opts = {}) => {
  const predicate = opts.predicate || null
  const match = check(predicate)
  return (state, event) => {
    const type =
      typeof event === 'string' || isFn(predicate) ? event : event.type
    return match(type) ? fn(state, event) : state
  }
}
