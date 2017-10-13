
import test from 'tape'

import {typeEvent} from '../src'

const passUpdate = (state, event) => state

test('typeEvent:: passed back a valid update function signature', t => {
  t.plan(2)

  const store = {}
  const event = {type: 'hello'}
  const update = (state, event) => {
    t.ok(state, 'state exists')
    t.ok(event, 'event exists')
  }

  typeEvent(update, store)({}, event)
})

test('typeEvent:: only events with a type member are considered', t => {
  t.plan(1)

  const store = {}
  const event = {unusual: 'hello'}
  const update = (s, e) => {
    t.equal(
      event,
      e,
      'Event is passed back unmodified'
    )
  }

  typeEvent(update, store)({}, event)
})

test('typeEvent:: a store can be passed to a typed event mapper', t => {
  t.plan(3)

  const store = {}
  const type = 'foo'
  const payload = 'bar'
  const event = {type}

  const typedUpdate = typeEvent(passUpdate, store)

  typedUpdate({}, event)
  t.equal(typeof store[type], 'function', 'Typed constructor is added to store')

  const action = store[type].of(payload)
  t.equal(action.join(), payload, 'Creates an action')

  typedUpdate({}, event)
  t.equal(Object.keys(store).length, 1, 'Event is only created once')
})

test('typeEvent:: creates a typed event', t => {
  t.plan(1)

  const store = {}
  const type = 'foo'
  const payload = 'bar'
  const event = {type, payload}
  const update = (s, e) => {
    t.equal(e.join(), payload, 'action is passed as an event')
  }

  typeEvent(update, store)({}, event)
})

test('typeEvent:: a custom action creator function can be passed', t => {
  t.plan(1)

  const store = {}
  const type = 'foo'
  const payload = 'bar'
  const meta = 'custom event'
  const event = {type, payload}
  const create = event => {
    return {
      of: payload => ({
        payload,
        meta
      })
    }
  }
  const update = (s, e) => {
    t.equal(e.meta, meta, 'Custom create function is invoked')
  }

  typeEvent(update, store, create)({}, event)
})
