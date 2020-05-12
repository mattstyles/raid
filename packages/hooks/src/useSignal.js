
import { useState } from 'react'

export const useSignal = (signal) => {
  // @TODO if no signal then try looking for a provider

  const [ state, setState ] = useState({})

  signal.observe(setState)

  return [ state, signal.emit ]
}
