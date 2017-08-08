
import {render} from 'react-dom'

import {Signal} from 'raid/src'
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
    <div style={{margin: 30, background: 'white', borderRadius: 3, padding: 12, display: 'table'}}>
      <h2 style={{margin: 6}}>{name}</h2>
      <p style={{margin: 6}}>{`Age: ${age}`}</p>
      <Button styles={{marginRight: 0, marginTop: 8}} onClick={dispatch('CHANGE')}>Update</Button>
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

signal.register(compress({
  'CHANGE': flow(
    updateName,
    updateAge
  )
}))

signal.observe(state => {
  render(
    <Person name={state.name} age={state.age} />,
    element
  )
})
