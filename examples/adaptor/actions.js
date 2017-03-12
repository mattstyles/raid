
import {signal} from './store'

export const ACTIONS = {
  ADD: 'actions:add',
  SUBTRACT: 'actions:subtract'
}

export const dispatch = type => {
  return event => {
    signal.emit({type})
  }
}
