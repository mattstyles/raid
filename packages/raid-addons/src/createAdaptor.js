
const identity = _ => _

export const createAdaptor = (cb) => {
  return function adaptor (signal) {
    let internalState = {}
    const detach = signal.observe(state => {
      internalState = state
    })
    function connect (selector, fn) {
      if (fn && !selector) {
        throw new Error('No state selector for connected function')
      }

      console.log('internals:', internalState)

      // selector is optional, if it is omitted then assume the first
      // argument is the component function
      const select = fn ? selector : identity
      const func = fn || selector

      return cb(select, () => internalState, func)
    }
    connect.detach = detach

    return connect
  }
}
