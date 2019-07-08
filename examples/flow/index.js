
import { render } from 'react-dom'

import { Signal } from 'raid'
import {
  compress,
  flow
} from 'raid-addons'

import { Card, Button, element, App, H2, P } from '../_common'

const signal = new Signal({
  name: 'Joe',
  age: 20
})

const dispatch = type => {
  return event => {
    signal.emit({ type })
  }
}

const Person = ({ name, age }) => (
  <Card>
    <H2>{name}</H2>
    <P>{`Age: ${age}`}</P>
    <Button onClick={dispatch('CHANGE')}>Update</Button>
  </Card>
)

const updateAge = state => {
  state.age++
  return state
}

const updateName = state => {
  state.name = state.name === 'Joe'
    ? 'Josie'
    : 'Joe'
  return state
}

signal.register(compress({
  'CHANGE': flow(
    updateName,
    updateAge
  )
}))

signal.observe(state => {
  render(
    <App state={state}>
      <Person name={state.name} age={state.age} />
    </App>,
    element
  )
})
