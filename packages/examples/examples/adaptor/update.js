
import { actions } from './actions'

export const counter = (state, event) => {
  if (event.type === actions.add) {
    return {
      ...state,
      count: state.count + 1
    }
  }

  if (event.type === actions.subtract) {
    return {
      ...state,
      count: state.count - 1
    }
  }

  return state
}
