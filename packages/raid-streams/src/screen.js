
import {fromEvent, mergeArray} from 'most'

export const actions = {
  resize: '@@window:resize',
  scroll: '@@window:scroll',
  orientation: '@@window:orientation'
}

export const resize = (opts = {
  debounce: 100,
  el: window
}) => {
  return fromEvent('resize', opts.el)
    .debounce(opts.debounce)
    .map(event => ({
      type: actions.resize,
      raw: event,
      width: event.target.innerWidth,
      height: event.target.innerHeight,
      timeStamp: event.timeStamp
    }))
}

export const scroll = (opts = {
  el: window
}) => {
  return fromEvent('scroll', opts.el)
    .map(event => ({
      type: actions.scroll,
      left: opts.el === window ? opts.el.scrollX : opts.el.scrollLeft,
      top: opts.el === window ? opts.el.scrollY : opts.el.scrollTop,
      timeStamp: event.timeStamp
    }))
}

export const orientation = () => {
  return fromEvent('orientationchange', window)
    .map(event => ({
      type: actions.orientation,
      angle: window.screen.orientation.angle,
      orientation: window.screen.orientation.type,
      timeStamp: event.timeStamp
    }))
}

export default () => {
  return mergeArray([
    resize(),
    scroll(),
    orientation()
  ])
}
