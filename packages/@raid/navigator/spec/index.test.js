
import './setup'

import tape from 'tape'

import { initial } from '../src'

tape('Initial state should contain stack and index', t => {
  t.plan(2)

  const navigation = initial.navigation
  const keys = Object.keys(navigation)

  t.ok(keys.includes('stack'), 'Navigation state key contains stack')
  t.ok(keys.includes('index'), 'Navigation state key contains index')
})
