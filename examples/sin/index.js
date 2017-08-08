
import 'babel-polyfill'
import {render} from 'react-dom'
import {Signal} from 'raid/src'

import {sin} from 'raid-addons/src'

import element from '../_common/element'
import Button from '../_common/actionButton'

const signal = new Signal({
  name: 'Joe',
  age: 20,
  isRequesting: false
})

const dispatch = type => {
  return payload => {
    signal.emit({type, payload})
  }
}

const Person = ({name, age, isRequesting}) => {
  return (
    <div style={{margin: 30, background: 'white', borderRadius: 3, padding: 12, display: 'table'}}>
      <h2 style={{margin: 6}}>{name}</h2>
      <Button
        styles={{
          marginRight: 0,
          marginTop: 8,
          background: 'rgb(125,91,166)',
          width: 180
        }}
        onClick={dispatch('CHANGE')}
      >
        {isRequesting ? 'Updating...' : 'Trigger Update'}
      </Button>
    </div>
  )
}

const delay = ms => {
  return {
    then: cb => setTimeout(cb, ms)
  }
}

const update = async (state, event) => {
  if (event.type !== 'CHANGE') {
    return state
  }

  if (state.isRequesting === true) {
    return state
  }

  await delay(1000)
  state.name = state.name === 'Joe'
    ? 'Josie'
    : 'Joe'
  state.isRequesting = false
  return state
}

const request = (state, event) => {
  if (event.type === 'CHANGE') {
    state.isRequesting = true
    return state
  }

  return state
}

signal.register(sin(signal, update))
signal.register(request)

signal.observe(state => {
  render(
    <Person name={state.name} age={state.age} isRequesting={state.isRequesting} />,
    element
  )
}, e => console.error(e))
