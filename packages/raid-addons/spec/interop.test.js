
import tape from 'tape'
import { Signal } from 'raid'

import { patch, compress } from '../src'

tape.only('Interop :: compress and patch', t => {
  t.plan(1)

  const signal = new Signal({
    foo: 'foo',
    bar: {
      baz: 'bar::baz',
      quux: 'bar::quux'
    }
  })
  const event = 'event'
  const expected = {
    baz: 'bar::baz',
    quux: 'bar::quux'
  }
  const compressed = compress({
    [event]: (state, payload) => {
      t.deepEqual(state, expected, 'compress and patch pass through state correctly')
    }
  })
  const patched = patch('bar', compressed)

  signal.register(patched)
  signal.emit({
    type: event,
    payload: 'a payload'
  })
})
