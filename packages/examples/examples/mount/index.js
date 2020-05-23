
/**
 * Mount can attach a stream to a signal.
 */

import { render } from 'react-dom'
import { fromEvent } from 'most'
import EventEmitter from 'eventemitter3'

import { Signal } from 'raid'

import { Flex, Spacer, Text, Button } from '@raid/basic-kit'
import { App, element } from '../_common'

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

const dispatch = type => payload => signal.emit({ type, payload })
const sourceDispatch = type => payload => emitter.emit('action', { type, payload })

const actions = {
  add: 'actions:add',
  subtract: 'actions:subtract',
  keydown: 'input:keydown'
}

// Update is attached to the signal and gets fired in response to original stream as well as the mounted stream
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
      <Flex row>
        <Button variant='primary' onClick={dispatch(actions.add)}>Add</Button>
        <Spacer px={2} />
        <Button
          colour='positive'
          onClick={sourceDispatch(actions.subtract)}
        >
          Subtract
        </Button>
      </Flex>
      <Spacer py={3} />
      <Text>Try hitting a key to see the mounted stream in action.</Text>
      <Spacer py={2} />
      {state.key && (
        <Text size={7}>{state.key}</Text>
      )}
    </App>,
    element
  )
})
