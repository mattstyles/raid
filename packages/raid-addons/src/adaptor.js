
import React from 'react'

const adaptor = signal => {
  let internalState = {}
  signal.observe(state => {
    internalState = state
  })
  return function connect (selector, Component) {
    if (!selector) {
      throw new Error('No state selector for connected component')
    }
    if (!Component) {
      throw new Error('No component specified to connect')
    }
    return props => {
      let state = selector(internalState)
      return <Component {...state} {...props} />
    }
  }
}

export default adaptor
