
import tape from 'tape'
import { renderHook } from '@testing-library/react-hooks'

import { useSignal } from '../src'
import { Signal } from 'raid'

tape('useSignal should return the state of the signal as a value', t => {
  t.plan(1)

  const state = { the: 'state' }
  const signal = Signal.of(state)
  signal.observe(state => {
    console.log('observer:', state)
  })
  setTimeout(() => {
    const result = renderHook(() => {
      const s = useSignal(signal)
      console.log('returned from useSignal', s)
      return s
    })

    console.log(result.current)
    t.equal(result.current, state, 'The initial state is returned')
  }, 10)
})
