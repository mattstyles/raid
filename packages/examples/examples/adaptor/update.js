
import { ACTIONS } from './actions'

export const counter = (state, event) => {
  if (event.type === ACTIONS.ADD) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  if (event.type === ACTIONS.SUBTRACT) {
    return {
      ...state,
      count: state.count - 1
    }
  }

  return state
}
