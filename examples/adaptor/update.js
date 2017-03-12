
import {ACTIONS} from './actions'

export const counter = (state, event) => {
  if (event.type === ACTIONS.ADD) {
    state.count += 1
    return state
  }

  if (event.type === ACTIONS.SUBTRACT) {
    state.count -= 1
    return state
  }

  return state
}
