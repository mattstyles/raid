
import { Card, Flex, Button, Text } from '@raid/basic-kit'

import { Signal } from 'raid'
import { safe, debug } from '@raid/addons'
import { useSignal } from '@raid/hooks'

export const counter = Signal.of({
  count: 0
})

const namedActions = {
  add: 'counter:add'
}
export const actions = {
  add: (value = 1) => ({
    type: namedActions.add,
    payload: {
      value
    }
  })
}

export const update = safe((state, event) => {
  if (event.type === namedActions.add) {
    return {
      ...state,
      count: state.count + event.payload.value
    }
  }
})

// This is a side effect but due to the way that (most?) bundlers work the
// file will only be executed once, so, although we include the file twice
// (in stateViewer.js and index.js) this side effect gets executed only once.
// Might cause an issue with hot-reload though.
counter.register(update)
counter.register(debug('[counter]'))

export const Counter = () => {
  const [state, dispatch] = useSignal(counter)

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => dispatch(actions.add(1))}>+</Button>
        <Button tight onClick={() => dispatch(actions.add(-1))}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}
