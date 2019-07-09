
import test from 'tape'
import fl from 'fantasy-land'

import { eq, identity, inc, add } from './utils'
import { createAction } from '../src'

test('actions should implement fantasy-land monad specification', t => {
  t.plan(10)

  const Action = createAction('action')
  const action = Action.of(1)

  t.ok(action[fl.map], 'fl/map exists')
  t.ok(action.map, 'map exists')
  t.ok(Action[fl.of], 'fl/of exists')
  t.ok(Action.of, 'of exists')
  t.ok(action[fl.chain], 'fl/chain exists')
  t.ok(action.chain, 'chain exists')
  t.ok(action[fl.ap], 'fl/ap exists')
  t.ok(action.ap, 'ap exists')
  t.ok(action[fl.equals], 'fl/equals exists')
  t.ok(action.equals, 'equals exists')
})

test('actions are a setoid', t => {
  t.plan(4)

  const Action = createAction('action')

  const x = Action.of(1)
  const y = Action.of(2)

  t.ok(x.equals(x), 'setoid::reflexivity')
  t.ok(x.equals(y) === y.equals(x), 'setoid::symmetry')

  const a = Action.of('action')
  const b = Action.of('action')
  const c = Action.of('action')

  t.ok(a.equals(b) === b.equals(c), 'setoid::transivity a-b-c')
  t.ok(a.equals(c), 'setoid::transivity a-c')
})

test('actions are a functor', t => {
  t.plan(2)

  const Action = createAction('action')

  const i = x => x
  const a = Action.of(1)

  t.equal(a.join(), a.map(i).join(), 'functor::identity')

  const f = x => ++x
  const g = x => x + 10

  t.equal(
    a.map(x => f(g(x))).join(),
    a.map(f).map(g).join(),
    'functor::composition'
  )
})

test('actions implement apply', t => {
  t.plan(2)

  const Action = createAction('action')

  const b = Action.of(inc)
  const a = Action.of(2)
  t.equal(a.ap(b).join(), 3, 'Apply b to a')

  const x = Action.of(2)
  const y = Action.of(1).map(add)
  t.equal(x.ap(y).join(), 3, 'Apply mapped 2-arity function')
})

test('actions are an applicative', t => {
  t.plan(5)

  const Action = createAction('action')

  const fn = Action.of(identity)
  t.ok(eq(fn.join(), identity), 'an action can be a function')

  const num = Action.of(1)
  t.ok(eq(num.join(), 1), 'an action can be a number')

  const str = Action.of('str')
  t.ok(eq(str.join(), 'str'), 'an action can be a string')

  const obj = Action.of({ v: 1 })
  t.ok(eq(obj.join(), { v: 1 }), 'an action can be an object')

  const arr = Action.of([1, 2, 3])
  t.ok(eq(arr.join(), [1, 2, 3]), 'an action can be an array')
})
