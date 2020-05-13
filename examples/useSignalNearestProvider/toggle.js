
import { Card, Button, Text } from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal } from '@raid/hooks'

export const toggleSignal = Signal.of({
  flag: false
})
export const toggleUpdate = (state, event) => {
  return {
    ...state,
    flag: !state.flag
  }
}

export const Toggle = () => {
  const [state, dispatch] = useSignal()

  console.log('toggle', state)

  return (
    <Card depth={1} sx={{ mt: 4, p: 3 }}>
      <Text block sx={{ pb: 3 }}>{state.flag ? 'On' : 'Off'}</Text>
      <Button onClick={() => dispatch({ type: 'toggle' })}>Toggle</Button>
    </Card>
  )
}
