
import {
  isDefined,
  isFn,
  check
} from './utils'

const scopedUpdate = (predicate, update) => {
  const match = check(predicate)
  return (state, event) => {
    let type = typeof event === 'string' || isFn(predicate)
      ? event
      : event.type

    let checked = isFn(predicate)
      ? predicate(state, event)
      : match(type)

    return checked
      ? state
      : update(state, event)
  }
}

const createScope = predicate => update => scopedUpdate(predicate, update)

const scope = (predicate, update) => {
  return isDefined(update)
    ? scopedUpdate(predicate, update)
    : createScope(predicate)
}

export default scope
