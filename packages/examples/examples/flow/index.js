
import { render } from 'react-dom'

import { Signal } from 'raid'
import {
  compress,
  flow
} from '@raid/addons'

import { Spacer, Card, Button, Text } from '@raid/basic-kit'
import { element, App } from '../_common'

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
    <Text block size={5}>{name}</Text>
    <Text block>{`Age: ${age}`}</Text>
    <Spacer py={2} />
    <Button variant='primary' onClick={dispatch('change')}>Update</Button>
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

/**
 * Compress is used to assign an update to a key.
 * Flow assigns multiple updates to a single key, and runs them sequentially.
 */
signal.register(compress({
  change: flow(
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
