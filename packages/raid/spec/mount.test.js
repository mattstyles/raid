
import tape from 'tape'
import { fromEvent } from 'most'
import EventEmitter from 'eventemitter3'

import { Signal } from '../src'

tape('Mount should add a new source to the signal', t => {
  t.plan(3)

  const msg = { foo: 'bar' }

  const signal = new Signal()
  signal.register((state, event) => {
    t.deepEqual(event.payload, msg, 'Source emit passes through signal updaters')
    return state
  })
  signal.observe(state => {
    // This should be called twice
    t.ok(state, 'Source emit passes to observers')
  })

  const emitter = new EventEmitter()
  const source = fromEvent('action', emitter)

  signal.mount(source)
  emitter.emit('action', { payload: msg })
})
