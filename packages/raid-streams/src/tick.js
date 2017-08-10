
import raf from 'raf-stream'
import {fromEvent} from 'most'

export const actions = {
  tick: '@@tick:tick'
}

const tick = (opts = {
  el: window
}) => {
  return fromEvent('data', raf(opts.el))
    .map(event => ({
      type: actions.tick,
      payload: {
        dt: event
      }
    }))
}

export default tick
