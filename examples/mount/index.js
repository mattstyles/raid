
import {render} from 'react-dom'

import {Signal} from 'raid'

import {App, H2, element, Button} from '../_common'

import {fromEvent} from 'most'
import EventEmitter from 'eventemitter3'

// Create main app signal
const signal = new Signal({
  count: 0
})

// Create mountable stream
const emitter = new EventEmitter()
const source = fromEvent('action', emitter)

const keys = fromEvent('keydown', window.document.body)
  .map(event => ({
    type: actions.keydown,
    key: event.key,
    keyCode: event.keyCode
  }))

// Apply stream as an input source for the main signal
signal.mount(source)
signal.mount(keys)

const dispatch = type => payload => signal.emit({type, payload})
const sourceDispatch = type => payload => emitter.emit('action', {type, payload})

const actions = {
  add: 'actions:add',
  subtract: 'actions:subtract',
  keydown: 'input:keydown'
}

const update = (state, event) => {
  if (event.type === actions.add) {
    state.count += 1
    return state
  }

  if (event.type === actions.subtract) {
    state.count -= 1
    return state
  }

  if (event.type === actions.keydown) {
    state.key = event.key
    return state
  }

  return state
}

signal.register(update)

signal.observe(state => {
  render(
    <App state={state}>
      <Button onClick={dispatch(actions.add)}>Add</Button>
      <Button
        onClick={sourceDispatch(actions.add)}
        background='rgb(24, 190, 80)'
      >Add 2</Button>
      {state.key && <H2>{state.key}</H2>}
    </App>,
    element
  )
})
