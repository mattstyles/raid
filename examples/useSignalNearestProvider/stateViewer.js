
import { Pane, Code, Divider } from '@raid/basic-kit'

import { useSignal } from '@raid/hooks'

import { counterSignal } from './counter'
import { toggleSignal } from './toggle'

export const StateViewer = () => {
  const [countState] = useSignal(counterSignal)
  const [toggleState] = useSignal(toggleSignal)

  return (
    <Pane sx={{ color: 'white' }}>
      <Pane sx={{ p: 2 }}>
        <Code>{JSON.stringify(countState, null, '  ')}</Code>
      </Pane>
      <Divider borderColor='light.200' />
      <Pane sx={{ p: 2 }}>
        <Code>{JSON.stringify(toggleState, null, '  ')}</Code>
      </Pane>
    </Pane>
  )
}
