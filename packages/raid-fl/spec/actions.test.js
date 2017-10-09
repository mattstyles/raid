
import test from 'tape'

import {inc, add} from './utils'
import {createAction, createActions} from '../src'

test('should create a new wrapped action class', t => {
  t.plan(2)

  const Action = createAction('action')
  const action = new Action(1)

  t.ok(Action.of, 'static method \'of\' exists')
  t.ok(action.join, 'method to unwrap exists')
})

test('should implement helper to create new action', t => {
  t.plan(1)

  const Action = createAction('action')
  const action = Action.of(1)

  t.ok(action instanceof Action, '\'of\' creates a new instance')
})

test('should wrap action value', t => {
  t.plan(2)

  const Action = createAction('action')

  const action = Action.of(1)
  t.equal(action.join(), 1, 'value is wrapped')

  const str = 'string'
  const act2 = Action.of(str)
  t.equal(act2.join(), str, 'value is wrapped')
})

test('should implement a static to assert type', t => {
  t.plan(1)

  const Action = createAction('action')

  const action = Action.of(1)
  t.ok(Action.is(action), '\'is\' performs a type check')
})

test('createActions can create multiple action types', t => {
  t.plan(2)

  const actionIds = ['one', 'two']
  const actions = createActions(actionIds)

  t.equal(actions.length, actionIds.length, 'correct number of actions is returned')

  const types = actions.reduce((count, Action) => {
    const action = Action.of(1)
    return action.join && action.join() === 1
      ? ++count
      : count
  }, 0)
  t.equal(types, actionIds.length, 'all actions can be unwrapped')
})

test('action methods should preserve wrapping', t => {
  t.plan(3)

  const Action = createAction('action')

  const a = Action.of(1)
  t.equal(a.chain(inc), 2, 'Chain should unwrap an operation')
  t.equal(a.map(inc).join(), 2, 'Map maintains wrapping')
  t.equal(a.ap(Action.of(inc)).join(), 2, 'Ap maintains wrapping')
})

test('actions implement a lift function to apply a value to them', t => {
  t.plan(1)

  const Action = createAction('action')

  const a = Action.of(add)
  const v = Action.of(1)
  const w = Action.of(2)
  t.equal(a.lift(v).lift(w).join(), 3, 'values can be applied to a function holding action')
})
