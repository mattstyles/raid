
import './setup'

import tape from 'tape'

import {getRouteIndex, findKey, getCurrentRoute} from '../src/utils'

tape('Should find a key in a list of keyed objects', t => {
  t.plan(2)

  const key = 'foo'
  const key2 = 'baz'
  const list = [{key}, {key: 'bar'}, {key: key2}, {key: 'quux'}]

  t.equal(findKey(key)(list), 0, 'Found the correct key')
  t.equal(findKey(key2)(list), 2, 'Found the correct key')
})

tape('Finds the route key from the stack', t => {
  t.plan(2)

  const route = {key: 'foo'}
  const route2 = {key: 'baz'}
  const list = [{key: 'foo'}, {key: 'bar'}, {key: 'baz'}, {key: 'quux'}]

  t.equal(getRouteIndex(route, list), 0, 'Found the correct key')
  t.equal(getRouteIndex(route2, list), 2, 'Found the correct key')
})

tape('Should return the current history state if it is found', t => {
  t.plan(2)

  const currentRoute = getCurrentRoute()

  t.ok(currentRoute.pathname, 'Pathname exists')
  t.ok(currentRoute.key, 'Key is generated')
})
