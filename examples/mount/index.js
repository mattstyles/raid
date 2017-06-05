
import {render} from 'react-dom'

import {Signal} from 'raid/src'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {View, Main, Code} from '../_common/layout'

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

const App = ({state}) => {
  return (
    <View>
      <Main>
        <Button onClick={dispatch(actions.add)}>Add</Button>
        <Button
          onClick={sourceDispatch(actions.add)}
          background='rgb(24, 190, 80)'
        >Add 2</Button>
      </Main>
      <Code>
        <pre>{JSON.stringify(state, null, '  ')}</pre>
      </Code>
    </View>
  )
}

signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
})
