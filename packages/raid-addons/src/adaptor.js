
import React from 'react'

const identity = a => a

const adaptor = signal => {
  let internalState = {}
  signal.observe(state => {
    internalState = state
  })
  return function connect (selector, Component) {
    if (!selector) {
      throw new Error('No state selector for connected component')
    }

    // selector is optional, if it is omitted then assume the first
    // argument is the component function
    const select = Component ? selector : identity
    const Comp = Component || selector

    return props => {
      let state = select(internalState)
      return <Comp {...state} {...props} />
    }
  }
}

export default adaptor
