
import {createAction} from './actions'

const typeId = '@@type'
const globalStore = {}

/**
 * Converts regular events in to typed events
 * Can be used with update functions that expect type events
 */
export const typeEvent = (update, store = globalStore, create = createAction) => {
  const map = event => {
    if (!event.type) {
      return event
    }

    const {type, payload = null} = event
    const typed = store[type]

    if (typed) {
      return typed.of(payload)
    }

    store[type] = create(type)
    return store[type].of(payload)
  }
  return (state, event) => update(state, map(event))
}

/**
 * Converts typed events in to regular events
 * Can be used with update functions that expect regular events
 */
export const untypeEvent = update => {
  const map = event => {
    if (!event.join || !event[typeId]) {
      return event
    }

    return {
      type: event[typeId],
      payload: event.join()
    }
  }
  return (state, event) => update(state, map(event))
}
