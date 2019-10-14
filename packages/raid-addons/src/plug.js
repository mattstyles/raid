
// const identity = _ => _
//
// export const plug = signal => {
//   let internalState = {}
//   signal.observe(state => {
//     internalState = state
//   })
//   return function connect (selector, fn) {
//     if (fn && !selector) {
//       throw new Error('No state selector for connected function')
//     }
//
//     // selector is optional, if it is omitted then assume the first
//     // argument is the connected function
//     const select = fn ? selector : identity
//     const func = fn || selector
//
//     return _ => {
//       let state = select(internalState)
//       return func(state, _)
//     }
//   }
// }

import { createAdaptor } from './createAdaptor'

export const plug = createAdaptor((select, getState, func) => {
  return props => {
    let state = select(getState())
    return func(state, props)
  }
})
