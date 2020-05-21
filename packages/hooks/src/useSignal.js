
import { useState, useContext, useEffect } from 'react'

import { SignalContext } from './provider'

const identity = _ => _

export const useSignal = (signal, {
  selector = identity
} = {}) => {
  if (!signal) {
    const value = useContext(SignalContext)
    return {
      state: selector(value.state),
      emit: value.emit
    }
  }

  const [state, setState] = useState(signal.current)

  useEffect(() => {
    return signal.observe(setState)
  }, [])

  return {
    state: selector(state),
    emit: signal.emit
  }
}
