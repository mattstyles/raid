
import tape from 'tape'
import { fromEvent } from 'most'
import EventEmitter from 'eventemitter3'

import { Signal } from '../src'

const makeStream = () => {
  const emitter = new EventEmitter()
  const source = fromEvent('action', emitter)

  return {
    source,
    emit: payload => emitter.emit('action', payload)
  }
}

const echoUpdate = pre => (state, event) => `${pre}${event.echo}`
const echo = _ => ({ echo: _ })

tape('Mount should add a new source to the signal', t => {
  t.plan(3)

  const msg = { foo: 'bar' }

  const signal = new Signal()
  signal.register((state, event) => {
    t.deepEqual(event.payload, msg, 'Source emit passes through signal updaters')
    return state
  })
  signal.observe(state => {
    t.ok(state, 'Source emit passes to observers')
  })

  const { source, emit } = makeStream()

  signal.mount(source)
  emit({ payload: msg })
})

tape('Mount should return a function that can be used to remove the mounted stream', t => {
  t.plan(1)

  const expected = ['one', 'two']
  const collect = []
  const signal = new Signal('one')
  signal.register(echoUpdate(''))
  signal.observe(state => {
    collect.push(state)
  })

  const { source, emit } = makeStream()
  emit(echo('this emission is not yet attached, so should not be collected'))

  const subscription = signal.mount(source)
  emit(echo('two'))

  // Give the 'two' message a chance, then unsubscribe
  setTimeout(() => {
    subscription.unsubscribe()
    emit(echo('should be unmounted, so this should not be collected'))

    // Give that last one a sec to _not_ be collected
    setTimeout(() => {
      t.deepEqual(collect, expected, 'Mounted and unmounted. Terrific.')
    }, 10)
  }, 10)
})

tape('Mount should also mount a signal', t => {
  t.plan(2)

  const expected1 = ['1>one', '1>two']
  const expected2 = ['2>one', '2>two', '2>three']
  const collect1 = []
  const collect2 = []
  const source = Signal.of('1>one')
  const supplier = Signal.of('2>one')

  source.register(echoUpdate('1>'))
  supplier.register(echoUpdate('2>'))

  source.observe(state => {
    collect1.push(state)
  })
  supplier.observe(state => {
    collect2.push(state)
  })

  const unmount = source.mount(supplier)
  supplier.emit(echo('two'))

  setTimeout(() => {
    unmount()
    supplier.emit(echo('three'))

    setTimeout(() => {
      t.deepEqual(collect1, expected1, 'Source stream collects events')
      t.deepEqual(collect2, expected2, 'Mounted stream collects events')
    }, 10)
  }, 10)
})
