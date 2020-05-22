
import { namespace } from './utils'

import { Signal } from 'raid'
import { flow } from '../src'

const test = namespace(__filename)

test('Should pass state through all update functions', t => {
  t.plan(1)

  const event = 'event'
  const signal = new Signal(0)

  const timer = setTimeout(() => t.fail('Did not trigger event'), 100)

  signal.register(flow(
    state => ++state,
    state => {
      t.equal(2, ++state, 'All updates triggered')
      clearTimeout(timer)
    }
  ))
  signal.emit({ type: event })
})
