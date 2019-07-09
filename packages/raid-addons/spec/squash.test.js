
import { namespace } from './utils'

import { Signal } from 'raid'
import { squash } from '../src'

const test = namespace(__filename)

test('Should return a function', t => {
  t.plan(1)
  const attach = squash('')
  t.equal('function', typeof attach, 'returns a function')
})

test('Should attach an update function to a specific event', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const attach = squash(event)
  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(attach([update]))
  signal.emit({ type: event })
})

test('Should ignore other events', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.pass('Did not trigger event'), 100)

  const attach = squash(event)
  const update = (state, payload) => {
    t.fail('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(attach([update]))
  signal.emit({ type: 'foo' })
})

test('Should accept a single update function', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal()

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const attach = squash(event)
  const update = (state, payload) => {
    t.pass('Update was triggered')
    clearTimeout(timer)
  }

  signal.register(attach(update))
  signal.emit({ type: event })
})

test('Should pass state through all update functions', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal(0)

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  const attach = squash(event)
  signal.register(attach([
    state => ++state,
    state => {
      t.equal(2, ++state, 'All updates triggered')
      clearTimeout(timer)
    }
  ]))
  signal.emit({ type: event })
})
