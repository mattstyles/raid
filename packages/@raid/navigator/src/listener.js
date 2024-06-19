
import { actions, dispatcher } from './actions'

export const createListener = signal => {
  const pop = dispatcher(signal, actions.pop)
  const push = dispatcher(signal, actions.push)

  return ({ location, action }) => {
    if (action === 'POP') {
      pop({ location })
    }

    if (action === 'PUSH') {
      push({ location })
    }
  }
}
