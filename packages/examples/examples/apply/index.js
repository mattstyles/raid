
/**
 * Signals can accept functions which are applied to every update.
 */

import { render } from 'react-dom'

import { Signal } from 'raid'
import { safe } from '@raid/addons/safe'

import { Flex, Card, Text, Input, Button } from '@raid/basic-kit'
import { App, element } from '../_common'

const signal = Signal.of({
  messages: [
    { id: 'raid', copy: 'I ❤️ Raid' },
    { id: 'js', copy: 'Always bet on JS' }
  ]
})

// Apply will make sure `safe` wraps every update
// The update is unsafe as it does not always return a new state, this applicator solves that problem by wrapping them whilst allowing them to run. Try commenting it out and deleting a message from the example.
signal.apply(safe)

const actions = {
  add: 'actions:add',
  remove: 'actions:remove'
}

const update = (state, event) => {
  if (event.type === actions.add) {
    state.messages.unshift({
      id: Math.random().toString(32),
      copy: event.payload
    })
    return state
  }

  if (event.type === actions.remove) {
    state.messages.shift()
    // Forgot to return state here, which would often leave the signal stream in
    // an undesirable state, but, the applicator has wrapped this update in the
    // `safe` higher-order function, so the side effect will run here and the
    // stream will remain in a determinant state.
    return
  }

  return state
}

const List = ({ messages }) => {
  return messages.map(msg => {
    return (
      <Card key={msg.id} sx={{ mb: 2 }}>
        <Text>{msg.copy}</Text>
      </Card>
    )
  })
}

signal.observe(state => {
  render(
    <App state={state}>
      <List messages={state.messages} />
      <Flex row sx={{ pt: state.messages.length ? 3 : 0 }}>
        <Input
          autoFocus
          variant='flat'
          placeholder='What’s on your mind?'
          submitOnEnter
          onSubmit={msg => signal.emit({ type: actions.add, payload: msg })}
        />
        <Button
          variant='solid'
          colour='critical'
          onClick={() => signal.emit({ type: actions.remove })}
          sx={{ ml: 4 }}
        >Delete Last
        </Button>
      </Flex>
    </App>,
    element
  )
})

signal.register(update)
