
import {fromEvent} from 'most'

export const actions = {
  resize: 'raid:resize'
}

const initial = {
  width: window.innerWidth,
  height: window.innerHeight
}

export const resize = fromEvent('resize', window)
  .scan((prev, event) => {
    const {innerWidth, innerHeight} = event.target
    return {
      width: innerWidth,
      height: innerHeight
    }
  }, initial)
  .map(payload => ({type: actions.resize, payload}))
