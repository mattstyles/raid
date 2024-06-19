import { check, isDefined, isFn } from './utils'

const scopedUpdate = (predicate, update) => {
  const match = check(predicate)
  return (state, event) => {
    const type =
      typeof event === 'string' || isFn(predicate) ? event : event.type

    const checked = isFn(predicate) ? predicate(state, event) : match(type)

    return checked ? update(state, event) : state
  }
}

const createScope = (predicate) => (update) => scopedUpdate(predicate, update)

export const scope = (predicate, update) =>
  isDefined(update) ? scopedUpdate(predicate, update) : createScope(predicate)
