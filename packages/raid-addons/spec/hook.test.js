
import {namespace} from './utils'

import {Signal} from 'raid'
import {hook} from '../src'

const test = namespace(__filename)

test('Should attach an update function to a specific event using a string', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(hook(update, {
    predicate: event
  }))
  signal.emit({type: event})
})

test('Should ignore other event strings', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.pass('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.fail('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(hook(update, {
    predicate: event
  }))
  signal.emit({type: 'foo'})
})

test('Should attach an update function to a specific event using a regex', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(hook(update, {
    predicate: /^ev/
  }))
  signal.emit({type: event})
})

test('Should ignore other events not matching regex', t => {
  t.plan(1)

  const signal = new Signal()

  const timer = setTimeout(() => t.pass('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.fail('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(hook(update, {
    predicate: /$ev/
  }))
  signal.emit({type: 'foo'})
})

test('Should attach an update function to a specific event using a function', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }
  const match = e => e.meta === 'test'

  signal.register(hook(update, {
    predicate: match
  }))
  signal.emit({type: event, meta: 'test'})
})

test('Should ignore other events not matching regex', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.pass('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.fail('Update was triggered')
    clearTimeout(timer)
  }
  const match = e => e.meta === 'test'

  signal.register(hook(update, {
    predicate: match
  }))
  signal.emit({type: event, meta: 'something else'})
})
