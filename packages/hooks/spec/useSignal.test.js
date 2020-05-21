
import React from 'react'
import tape from 'tape'
import { renderHook, act } from '@testing-library/react-hooks'

import { useSignal, SignalProvider } from '../src'
import { Signal } from 'raid'

const echo = (state, event) => event.payload
const echoAction = payload => ({ payload })

tape('useSignal always returns the correct value from the signal', t => {
  t.plan(4)

  const signal = Signal.of('one')
  signal.register(echo)

  const { result } = renderHook(() => useSignal(signal))

  t.equal(result.current.state, 'one', 'Initial state is correct')
  t.equal(typeof result.current.emit, 'function', 'Emit function is returned')

  act(() => {
    result.current.emit({ payload: 'two' })
  })

  // Emit is async so we need to wait a bit
  setTimeout(() => {
    t.equal(result.current.state, 'two', 'Updated state is correct')
    t.equal(typeof result.current.emit, 'function', 'Emit function is returned')
  }, 0)
})

tape('useSignal will use context when a signal is not supplied', t => {
  t.plan(4)

  const expected = 'one'
  const signal = Signal.of(expected)
  signal.register(echo)
  const wrapper = ({ children }) => (
    <SignalProvider signal={signal}>
      {children}
    </SignalProvider>
  )

  const { result } = renderHook(() => useSignal(), { wrapper })

  t.equal(result.current.state, expected, 'Initial state is returned from the provider')
  t.equal(typeof result.current.emit, 'function', 'emit function is returned')

  const expected2 = 'two'

  act(() => {
    result.current.emit(echoAction(expected2))
  })

  setTimeout(() => {
    t.equal(result.current.state, expected2, 'Updated state is returned from the provider')
    t.equal(typeof result.current.emit, 'function', 'emit function is returned')
  }, 0)
})

tape('useSignal accepts a selector', t => {
  t.plan(1)

  const expected = 21
  const signal = Signal.of({
    count: expected
  })
  const selector = state => state.count

  const { result } = renderHook(() => useSignal(signal, { selector }))

  t.equal(result.current.state, expected, 'useSignal returns the selected state')
})

tape('useSignal with context accepts a selector', t => {
  t.plan(1)

  const expected = 21
  const signal = Signal.of({
    count: expected
  })
  const selector = state => state.count
  const wrapper = ({ children }) => (
    <SignalProvider signal={signal}>
      {children}
    </SignalProvider>
  )

  const { result } = renderHook(() => useSignal(null, { selector }), { wrapper })

  t.equal(result.current.state, expected, 'useSignal returns the selected state')
})
