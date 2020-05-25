
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
        left: el.scrollLeft || el.scrollX,
        top: el.scrollTop || el.scrollY,
        timeStamp: event.timeStamp
      }
    }))
}
