
import test from 'tape'

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
