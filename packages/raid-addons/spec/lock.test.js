
import { namespace } from './utils'

import { Signal } from 'raid'
import { lock } from '../src'

const test = namespace(__filename)

test('Should manage blocking a an update', t => {
  t.plan(3)

  const signal = Signal.of({
    count: 1
  })

  let dispose = null
  const register = lock(signal)

  const force = (state, event) => {
    if (event.type === 'two') {
      t.pass('Has taken control properly')
    }
  }

  const update = (state, event) => {
    if (event.type === 'one') {
      t.pass('Fires on the first emission')
      return state
    }

    if (event.type === 'two') {
      t.fail('should not be subscribed now')
      return state
    }

    if (event.type === 'three') {
      t.pass('Is resubscribed now')
      return state
    }
  }

  register(update)
  signal.emit({ type: 'one' })
  setTimeout(() => {
    dispose = register(force)
    signal.emit({ type: 'two' })
  }, 100)
  setTimeout(() => {
    dispose()
    signal.emit({ type: 'three' })
  }, 200)
}, true)
