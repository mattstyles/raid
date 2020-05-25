
import { actions } from '@raid/streams/keys'

export const sizeUpdate = (state, event) => {
  if (event.type === actions.keypress) {
    let mx = 0
    let my = 0

    if (event.payload.keys.has('<up>')) {
      my = -1
    }

    if (event.payload.keys.has('<down>')) {
      my = 1
    }

    if (event.payload.keys.has('<left>')) {
      mx = -1
    }

    if (event.payload.keys.has('<right>')) {
      mx = 1
    }

    return {
      ...state,
      width: state.width + mx,
      height: state.height + my
    }
  }

  return state
}
