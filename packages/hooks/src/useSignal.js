
import { useState, useContext, useEffect } from 'react'

import { SignalContext } from './provider'

const identity = _ => _

/**
 * @typedef {Object} SignalResponse
 * @property {Object} state - passed through a selector and then returned from the signal
 * @property {Function} emit - the signal’s emit function
 */

/**
 * @function useSignal
 * @param signal {?Signal} - the Raid signal to attach to
 * @param options {?Object} - set up the signal
 * @param options.selector {?Function[state:Object]} - can be used to transform the returned state
 * @returns {SignalResponse}
 */
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
