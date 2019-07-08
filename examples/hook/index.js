
import { render } from 'react-dom'

import {
  compress,
  hook
} from 'raid-addons'

import { App, element } from '../_common'

import { signal } from './store'
import { actions } from './actions'
import { Person } from './person'

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
    <App state={state}>
      <Person name={state.name} age={state.age} />
    </App>,
    element
  )
})
