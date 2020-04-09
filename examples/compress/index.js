
import { render } from 'react-dom'

import { Signal } from 'raid'
import {
  compress,
  flow
} from '@raid/addons'

import { Box, Button, element, App, H2, P } from '../_common'

const signal = new Signal({
  name: 'Joe',
  age: 20
})

const dispatch = type => {
  return event => {
    signal.emit({ type })
  }
}

const Person = ({ name, age }) => {
  return (
    <Box isPadded>
      <H2 onClick={dispatch('CHANGE_NAME')}>{name}</H2>
      <P onClick={dispatch('CHANGE_AGE')}>{`Age: ${age}`}</P>
      <Button
        onClick={dispatch('CHANGE')}
      >Update</Button>
    </Box>
  )
}

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

const update = flow(
  updateName,
  updateAge
)

signal.register(compress({
  'CHANGE_NAME': updateName,
  'CHANGE_AGE': updateAge
}))

signal.register(compress('CHANGE')(update))

signal.observe(state => {
  render(
    <App state={state}>
      <Person name={state.name} age={state.age} />
    </App>,
    element
  )
})
