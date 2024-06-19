
import React, { useEffect, useState, createContext } from 'react'

export const SignalContext = createContext()

// Consumers are exposed, partly because they enable combining contexts
export const SignalConsumer = SignalContext.Consumer

export const SignalProvider = ({
  signal,
  // update,
  children
}) => {
  const [state, setState] = useState(signal.current)

  useEffect(() => {
    // if (update) {
    //   signal.register(update)
    // }

    // @TODO if updates can be added then we need to clean them up in here, as
    // well as detach the observer we set here
    return signal.observe(setState)
  }, [undefined])

  return (
    <SignalContext.Provider value={{ state, emit: signal.emit }}>
      {children}
    </SignalContext.Provider>
  )
}
