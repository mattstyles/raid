
import { useState, useContext, useEffect } from 'react'

import { SignalContext } from './provider'

const identity = _ => _

// @TODO handle adding a selector also, an update might be good too (which would be deregistered when done)
export const useSignal = (signal, selector = identity) => {
  if (!signal) {
    const value = useContext(SignalContext)
    return [selector(value.state), value.emit]
  }

  const [state, setState] = useState({})

  useEffect(() => {
    return signal.observe(setState)
  }, [undefined])

  return [selector(state), signal.emit]
}
