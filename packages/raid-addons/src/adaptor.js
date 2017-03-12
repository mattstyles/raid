
const adaptor = signal => {
  let internalState = {}
  signal.observe(state => {
    internalState = state
  })
  return function connect (selector, Component) {
    return props => {
      let state = selector(internalState)
      return <Component {...state} {...props} />
    }
  }
}

export default adaptor
