
import { Card, Flex, Button, Text } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal } from '@raid/hooks'
import { safe } from '@raid/addons'

export const counterSignal = Signal.of({
  count: 0
})

const namedActions = {
  apply: 'counter:apply'
}
export const counterActions = {
  apply: (value = 1) => ({
    type: namedActions.apply,
    payload: { value }
  })
}
export const counterUpdate = safe((state, event) => {
  if (event.type === namedActions.apply) {
    return {
      ...state,
      count: state.count + event.payload.value
    }
  }
})

export const Counter = () => {
  const { state, emit } = useSignal()

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => emit(counterActions.apply(1))}>+</Button>
        <Button tight onClick={() => emit(counterActions.apply(-1))}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}
