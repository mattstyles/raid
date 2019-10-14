
const identity = _ => _

export const createAdaptor = (cb) => {
  return function adaptor (signal) {
    let internalState = {}
    signal.observe(state => {
      internalState = state
    })
    return function connect (selector, fn) {
      if (fn && !selector) {
        throw new Error('No state selector for connected function')
      }

      // selector is optional, if it is omitted then assume the first
      // argument is the component function
      const select = fn ? selector : identity
      const func = fn || selector

      // return props => {
      //   let state = select(internalState)
      //   return func(state, props)
      // }

      // return cb(select, internalState, func)

      return cb(select, () => internalState, func)
    }
  }
}
