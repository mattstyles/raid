
/**
 * A provider can be created to wrap the SignalProvider and create a new
 * signal when instantiated.
 */

import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import { Card, Flex, Text, Button, Spacer } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal, SignalProvider } from '@raid/hooks'
import { debug } from '@raid/addons/debug'
import { safe } from '@raid/addons/safe'

import { App, element } from '../_common'

const Info = () => <Text>Example of a Provider which will create a new signal context when used.</Text>

const namedActions = {
  apply: 'counter:apply'
}
const actions = {
  apply: (value = 1) => ({
    type: namedActions.apply,
    payload: { value }
  })
}
const update = safe((state, event) => {
  if (event.type === namedActions.apply) {
    return {
      ...state,
      count: state.count + event.payload.value
    }
  }
})

const ProvideSignalProvider = ({ children }) => {
  const [signal] = useState(Signal.of({ count: 44 }))
  useEffect(() => {
    signal.register(debug('[counter]'))
    signal.register(update)

    return () => {
      signal.disposeAll()
      // @TODO Use signal.destroy here to tidy up
    }
  }, [])

  return (
    <SignalProvider signal={signal}>
      {children}
    </SignalProvider>
  )
}

const Counter = () => {
  const { state, emit } = useSignal()

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => emit(actions.apply(1))}>+</Button>
        <Button tight onClick={() => emit(actions.apply(-1))}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}

const AppViewer = ({ children }) => {
  const { state } = useSignal()

  return (
    <App state={state}>
      {children}
    </App>
  )
}

render(
  <ProvideSignalProvider>
    <AppViewer>
      <Info />
      <Spacer py={2} />
      <Counter />
    </AppViewer>
  </ProvideSignalProvider>,
  element
)
