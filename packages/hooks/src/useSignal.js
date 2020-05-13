
import { useState, useContext } from 'react'

import { SignalContext } from './provider'

export const useSignal = (signal) => {
  if (!signal) {
    // Should it always attach? Probably, or should it wrap in a useEffect?
    const value = useContext(SignalContext)
    console.log('useContext:', value)
    return [value.state, value.emit]
  }

  const [state, setState] = useState({})

  signal.observe(setState)

  return [state, signal.emit]
}
