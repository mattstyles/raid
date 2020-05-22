
import tape from 'tape'
import { Signal } from 'raid'

import { arc, patch, compress } from '../src'

tape('Interop :: compress and patch', t => {
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

tape('Interop :: compress and arc', t => {
  t.plan(3)

  const signal = new Signal({
    foo: 'bar'
  })
  const action = {
    type: 'action',
    payload: 'payload'
  }
  const update = (getState, payload, s) => {
    t.deepEqual({
      foo: 'bar'
    }, getState(), 'state can be grabbed')
    t.deepEqual(payload, action.payload, 'event is passed through')
    t.deepEqual(s, signal, 'signal should be the correct signal')
  }

  const fn = arc(signal)(compress({
    [action.type]: update
  }))
  signal.register(fn)
  signal.emit(action)
})

tape('Interop :: patch, compress and arc', t => {
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
    [event]: (getState, payload) => {
      t.deepEqual(getState(), expected, 'arcs can be patched and compressed and still grab state correctly')
    }
  })
  const patched = patch('bar', compressed)

  signal.register(arc(signal)(patched))
  signal.emit({
    type: event,
    payload: 'a payload'
  })
})
