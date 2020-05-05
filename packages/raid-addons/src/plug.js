
import { createAdaptor } from './createAdaptor'

export const plug = createAdaptor((select, getState, func) => {
  return props => {
    let state = select(getState())
    return func(state, props)
  }
})
