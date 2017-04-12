
import './setup'

import tape from 'tape'

import {
  selector
} from '../src/update'

tape('Selector should pluck the key from state', t => {
  t.plan(2)

  const defaultState = {
    navigation: 'foo'
  }

  t.equal(selector()(defaultState), 'foo', 'Default key is used')

  const key = '_nav'
  const state = {
    '_nav': 'bar'
  }

  t.equal(selector(key)(state), 'bar', 'Specified key is used')
})
