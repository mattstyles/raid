
/**
 * Without a specified signal `useSignal` will use the nearest context
 * provider.
 *
 * @TODO this only 'works' because adding the `StateViewer` triggers a
 * rerender, which propagates the `Counter` and `Toggle`.
 */

import { render } from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { theme, GlobalStyle, Screen, Pane, Box } from '@raid/basic-kit'

import { debug } from '@raid/addons/debug'
import { SignalProvider } from '@raid/hooks'

import { element } from '../_common'
import { Counter, counterUpdate, counterSignal } from './counter'
import { Toggle, toggleUpdate, toggleSignal } from './toggle'
import { StateViewer } from './stateViewer'

counterSignal.register(debug('[counter]'))
counterSignal.register(counterUpdate)

toggleSignal.register(debug('[toggle]'))
toggleSignal.register(toggleUpdate)

render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Screen isFlex>
      <Pane split>
        <Pane sx={{ p: 2, bg: 'background.75' }}>
          <SignalProvider signal={counterSignal}>
            <Counter />
            <Box sx={{ mt: 4 }}>
              <SignalProvider signal={toggleSignal}>
                <Toggle />
              </SignalProvider>
            </Box>
          </SignalProvider>
        </Pane>
        <Pane sx={{ borderLeft: 'light.100', bg: 'background.800' }}>
          <StateViewer />
        </Pane>
      </Pane>
    </Screen>
  </ThemeProvider>,
  element
)
