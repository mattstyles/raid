
import {render} from 'inferno-dom'

import compress from '../../src/compress'
import hook from '../../src/hook'

import element from '../_common/element'

import {signal} from './store'
import {actions} from './actions'
import {Person} from './person'

const changeName = state => {
  state.name = state.name === 'Joe'
    ? 'Josie'
    : 'Joe'
  return state
}

const changeAge = state => {
  state.age++
  return state
}

const log = state => {
  console.log(state)
  return state
}

signal.register(compress({
  [actions.changeName]: changeName,
  [actions.changeAge]: changeAge
}))

signal.register(hook(log, {
  predicate: event => {
    return /^change/.test(event.meta)
  }
  // predicate: /^change/
  // precicate: actions.changeName
}))

signal.observe(state => {
  render(
    <Person name={state.name} age={state.age} />,
    element
  )
})
