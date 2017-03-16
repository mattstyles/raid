
import {namespace} from './utils'

import {Signal} from 'raid'
import {arc} from '../src'

const test = namespace(__filename)

test('Should provide a function for update function to grab current state', t => {
  t.plan(1)

  const update = (getState, event) => {
    t.equal(typeof getState, 'function', 'get state should be a function')
  }

  const fn = arc(new Signal())(update)
  fn(null)
})
