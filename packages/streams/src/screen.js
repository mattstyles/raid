
import { fromEvent, mergeArray } from 'most'

import { scroll as elementScroll } from './element'

export const actions = {
  scroll: '@@window:scroll',
  orientation: '@@window:orientation',
  resize: '@@window:resize'
}

export const scroll = () => {
  return elementScroll({
    el: window,
    type: actions.scroll
  })
}

export const orientation = () => {
  return fromEvent('orientationchange', window)
    .map(event => ({
      type: actions.orientation,
      payload: {
        raw: event,
        angle: window.screen.orientation.angle,
        orientation: window.screen.orientation.type,
        timeStamp: event.timeStamp
      }
    }))
}

// Resize refers only to the window event
// Using ResizeObserver to watch an element is a separate stream
export const resize = ({
  debounce = 100
} = {}) => {
  return fromEvent('resize', window)
    .debounce(debounce)
    .map(event => ({
      type: actions.resize,
      payload: {
        raw: event,
        width: event.target.innerWidth,
        height: event.target.innerHeight,
        timeStamp: event.timeStamp
      }
    }))
}

export const screen = () => {
  return mergeArray([
    scroll(),
    orientation(),
    resize()
  ])
}
