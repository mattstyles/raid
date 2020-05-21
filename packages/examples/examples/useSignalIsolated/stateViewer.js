
import { Pane, Code, Divider } from '@raid/basic-kit'

import { useSignal } from '@raid/hooks'

import { counter } from './counter'
import { toggle } from './toggle'

export const StateViewer = () => {
  const { state: countState } = useSignal(counter)
  const { state: toggleState } = useSignal(toggle)

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
