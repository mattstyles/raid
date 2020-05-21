
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
import { theme, GlobalStyle, Screen, Pane } from '@raid/basic-kit'

import { debug } from '@raid/addons/debug'

import { element } from '../_common'
import { Counter } from './counter'
import { toggle, update as toggleUpdate, Toggle } from './toggle'
import { StateViewer } from './stateViewer'

// These are done in the counter file (which could easily be a package) which
// is good for isolation, but, it introduces a side effect from importing the
// file, which is not so good.
// counter.register(counterUpdate)
// counter.register(debug('[counter]'))

// Side effects are controlled here but require us here, as the application,
// to understand the toggle we’re setting up here.
toggle.register(toggleUpdate)
toggle.register(debug('[toggle]'))

render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <Screen isFlex>
      <Pane split>
        <Pane sx={{ p: 2, bg: 'background.75' }}>
          <Counter />
          <Toggle />
        </Pane>
        <Pane sx={{ borderLeft: 'light.100', bg: 'background.800' }}>
          <StateViewer />
        </Pane>
      </Pane>
    </Screen>
  </ThemeProvider>,
  element
)
