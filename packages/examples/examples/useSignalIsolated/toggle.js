
import { Card, Button, Text } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal } from '@raid/hooks'

export const toggle = Signal.of({
  flag: false
})
export const update = (state, event) => {
  return {
    ...state,
    flag: !state.flag
  }
}

export const Toggle = () => {
  const { state, emit } = useSignal(toggle)

  return (
    <Card depth={1} sx={{ mt: 4, p: 3 }}>
      <Text block sx={{ pb: 3 }}>{state.flag ? 'On' : 'Off'}</Text>
      <Button onClick={() => emit({ type: 'toggle' })}>Toggle</Button>
    </Card>
  )
}
