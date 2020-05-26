
import raf from 'raf-stream'
import { fromEvent } from 'most'

export const actions = {
  tick: '@@tick:tick'
}

export const tick = ({
  el = window,
  type = actions.tick
} = {}) => {
  return fromEvent('data', raf(el))
    .map(event => ({
      type: type,
      payload: {
        dt: event
      }
    }))
}
