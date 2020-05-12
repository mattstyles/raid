
/**
 * The useSignal hook lets a component use a react hook (rather than
 * using the adaptor HOC or direct access) to interface with a signal.
 *
 * Each `useSignal` internally manages state and will trigger renders
 * when that state changes, which means you can forego manually
 * calling render for the entire app.
 *
 * Combining signals within a component will also keep the UI fresh.
 */

import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'
import {
  theme, GlobalStyle,
  Screen, Flex, Pane, Divider,
  Card, Text, Button, Code
} from '@raid/basic-kit'

import { Signal } from 'raid'
import { useSignal } from '@raid/hooks'
import { debug } from '@raid/addons/debug'

import { element } from '../_common'

const counter = Signal.of({
  count: 0
})
const update = (state, event) => {
  if (event.type === 'inc') {
    return {
      ...state,
      count: state.count + 1
    }
  }

  if (event.type === 'dec') {
    return {
      ...state,
      count: state.count - 1
    }
  }

  return state
}
counter.register(update)
counter.register(debug('[counter]'))

const toggler = Signal.of({
  flag: false
})
const toggleUpdate = (state, event) => {
  return {
    ...state,
    flag: !state.flag
  }
}
toggler.register(toggleUpdate)
toggler.register(debug('[toggle]'))

const Control = () => {
  const [state, dispatch] = useSignal(counter)

  return (
    <Card depth={1} sx={{ p: 3 }}>
      <Flex row sx={{ pb: 3 }}>
        <Button sx={{ mr: 2 }} tight onClick={() => dispatch({ type: 'inc' })}>+</Button>
        <Button tight onClick={() => dispatch({ type: 'dec' })}>-</Button>
      </Flex>
      <Text size={3}>{`Count: ${state.count}`}</Text>
    </Card>
  )
}

const Toggle = () => {
  const [state, dispatch] = useSignal(toggler)

  return (
    <Card depth={1} sx={{ mt: 4, p: 3 }}>
      <Text block sx={{ pb: 3 }}>{state.flag ? 'On' : 'Off'}</Text>
      <Button onClick={() => dispatch({ type: 'toggle' })}>Toggle</Button>
    </Card>
  )
}

const CombinedState = () => {
  const [ countState ] = useSignal(counter)
  const [ toggleState ] = useSignal(toggler)

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

render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Screen isFlex>
      <Pane split>
        <Pane sx={{ p: 2 }}>
          <Control />
          <Toggle />
        </Pane>
        <Pane sx={{ borderLeft: 'light.100', bg: 'background.800' }}>
          <CombinedState />
        </Pane>
      </Pane>
    </Screen>
  </ThemeProvider>,
  element
)
