
import {render} from 'inferno-dom'

import {Signal} from 'raid'
import {
  compress,
  flow
} from 'raid-addons/src'

import element from '../_common/element'
import Button from '../_common/actionButton'

const signal = new Signal({
  name: 'Joe',
  age: 20
})

const dispatch = type => {
  return event => {
    signal.emit({type})
  }
}

const Person = ({name, age}) => {
  return (
    <div style={{padding: 30}}>
      <h2 onClick={dispatch('CHANGE_NAME')}>{name}</h2>
      <p onClick={dispatch('CHANGE_AGE')}>{`Age: ${age}`}</p>
      <Button
        onClick={dispatch('CHANGE')}
      >Update</Button>
    </div>
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
    <Person name={state.name} age={state.age} />,
    element
  )
})
