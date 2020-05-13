
import React, { useEffect, useState, createContext } from 'react'

export const SignalContext = createContext()

// Consumers are exposed, partly because they enable combining contexts
export const SignalConsumer = SignalContext.Consumer

export const SignalProvider = ({
  signal,
  update,
  children
}) => {
  const [state, setState] = useState({})

  useEffect(() => {
    if (update) {
      signal.register(update)
    }

    // This doesn't work because it won't get an initial value as it is
    // attached _after_ that initial value has been emitted.
    const detach = signal.observe(state => {
      console.log('observer:', state)
      setState(state)
    })

    return () => {
      console.log('detaching observer')
      detach()
    }
  }, [])

  return (
    <SignalContext.Provider value={{ state, emit: signal.emit }}>
      {children}
    </SignalContext.Provider>
  )
}
