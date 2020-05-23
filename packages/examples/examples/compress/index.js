
import { render } from 'react-dom'

import { Signal } from 'raid'
import {
  compress,
  flow,
  debug
} from '@raid/addons'

import { Spacer, Flex, Card, Button, Text } from '@raid/basic-kit'
import { App, element } from '../_common'

const signal = new Signal({
  name: 'Joe',
  age: 20
})

const dispatch = type => {
  return event => {
    signal.emit({ type })
  }
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

const actions = {
  changeName: 'action:changeName',
  changeAge: 'action:changeAge',
  change: 'action:change'
}

const Person = ({ name, age }) => {
  return (
    <Card depth={1}>
      <Flex row sx={{ alignItems: 'center' }}>
        <Button
          variant='transparent'
          size='small'
          tight
          icon
          onClick={dispatch(actions.changeName)}
        >
          😃
        </Button>
        <Spacer px={1} />
        <Text as='h2' size={5}>{name}</Text>
      </Flex>
      <Flex row sx={{ alignItems: 'center' }}>
        <Button
          variant='transparent'
          size='small'
          tight
          icon
          onClick={dispatch(actions.changeAge)}
        >
          🍺
        </Button>
        <Spacer px={1} />
        <Text>{`Age: ${age}`}</Text>
      </Flex>

      <Spacer py={2} />
      <Button
        variant='primary'
        onClick={dispatch(actions.change)}
      >
        Both
      </Button>
    </Card>
  )
}

signal.register(debug('>>'))

/**
 * Object form of compress
 */
signal.register(compress({
  [actions.changeName]: updateName,
  [actions.changeAge]: updateAge
}))

/**
 * String form of compress.
 * Returns a function which can be used to assign updates to an action key later.
 */
signal.register(compress(actions.change)(update))

signal.observe(state => {
  render(
    <App state={state}>
      <Person name={state.name} age={state.age} />
    </App>,
    element
  )
})
