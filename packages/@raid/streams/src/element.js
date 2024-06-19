
import { fromEvent } from 'most'

export const actions = {
  scroll: '@@element/scroll'
}

export const scroll = ({
  el = window,
  type = actions.scroll
} = {}) => {
  return fromEvent('scroll', el)
    .map(event => ({
      type: type,
      payload: {
        raw: event,
        left: el === window ? el.scrollX : el.scrollLeft,
        top: el === window ? el.scrollY : el.scrollTop,
        timeStamp: event.timeStamp
      }
    }))
}
