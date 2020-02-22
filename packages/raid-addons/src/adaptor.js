
import React from 'react'

import { createAdaptor } from './createAdaptor'

export const adaptor = createAdaptor((select, getState, Component) => {
  return props => {
    const state = select(getState())
    return <Component {...state} {...props} />
  }
})
