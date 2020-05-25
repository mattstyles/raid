
import { fromEvent, mergeArray } from 'most'

export const actions = {
  resize: '@@window:resize',
  scroll: '@@window:scroll',
  orientation: '@@window:orientation'
}

export const resize = ({
  debounce = 100,
  el = window
} = {}) => {
  return fromEvent('resize', el)
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

export const scroll = ({
  el = window
} = {}) => {
  return fromEvent('scroll', el)
    .map(event => ({
      type: actions.scroll,
      payload: {
        raw: event,
        left: el.scrollLeft || el.scrollX,
        top: el.scrollTop || el.scrollY,
        timeStamp: event.timeStamp
      }
    }))
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

export default () => {
  return mergeArray([
    resize(),
    scroll(),
    orientation()
  ])
}
