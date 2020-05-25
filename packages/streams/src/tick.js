
import raf from 'raf-stream'
import { fromEvent } from 'most'

export const actions = {
  tick: '@@tick:tick'
}

export const tick = ({
  el = window
} = {}) => {
  return fromEvent('data', raf(el))
    .map(event => ({
      type: actions.tick,
      payload: {
        dt: event
      }
    }))
}
