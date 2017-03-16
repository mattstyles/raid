
import util from 'util'
import {namespace} from './utils'

import {Signal} from 'raid'
import {compress} from '../src'

const test = namespace(__filename)

test('Should attach an update function to a specific event', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(compress({
    [event]: update
  }))

  signal.emit({type: event})
})

test('Should successfully ignore triggering updates for irrelevant events', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.pass('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.fail('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(compress({
    'another event': update
  }))

  signal.emit({type: event})
})

test('Should pass state and payload through to the update function', t => {
  t.plan(3)

  const state = {foo: 'bar'}
  const payload = {bar: 'quux'}
  const events = {
    payload: 'payload',
    empty: 'empty'
  }

  const signal = new Signal(state)

  const checkPayload = (s, p) => {
    t.deepEqual(s, state, 'State is correct')
    t.deepEqual(p, payload, 'Payload is correct')
  }

  const checkEmpty = (s, p) => {
    t.ok(util.isUndefined(p), 'Payload is not required on events')
  }

  signal.register(compress({
    [events.payload]: checkPayload,
    [events.empty]: checkEmpty
  }))

  signal.emit({type: events.payload, payload})
  signal.emit({type: events.empty})
})

test('Should accept an event key', t => {
  t.plan(1)

  const event = 'event'
  const attach = compress(event)

  t.equal('function', typeof attach, 'Function returns when string key provided')
})

test('String key version should trigger on events', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }

  const attach = compress(event)
  signal.register(attach(update))
  signal.emit({type: event})
})

test('String key version ignores events', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.pass('Did not trigger event'), 100)

  const update = (state, payload) => {
    t.fail('Update was triggered')
    clearTimeout(timer)
  }
  const attach = compress(event)

  signal.register(attach(update))
  signal.emit({type: 'another event'})
})
