
import { render } from 'react-dom'

import { Signal } from 'raid'
import {
  scope,
  compress,
  adaptor
} from '@raid/addons'

import {
  App,
  element,
  Button,
  theme,
  Count,
  P,
  Card,
  Box
} from '../_common'

const screens = {
  loading: 'screen:loading',
  main: 'screen:main'
}
const signal = new Signal({
  screen: screens.loading,
  count: 0
})
const connect = adaptor(signal)

const actions = {
  navigate: 'actions:navigate',
  add: 'actions:add'
}

const dispatch = type => payload => signal.emit({ type, payload })
const navigate = dispatch(actions.navigate)
const navigateTo = payload => event => navigate(payload)

const Loading = () => (
  <div>
    <P>Clicking add will dispatch an event here, but it will not match in the updater.</P>
  </div>
)

const MainScreen = connect(
  ({ count }) => ({ count }),
  ({ count }) => (
    <div>
      <P>The updater can access state and realise it should respond to add events.</P>
      <Count>{count}</Count>
    </div>
  )
)

const ActionBar = ({ children }) => {
  return (
    <div>
      <Box isMargin>
        <Button onClick={navigateTo(screens.loading)}>Loading</Button>
        <Button onClick={navigateTo(screens.main)}>Main</Button>
        <Button
          onClick={dispatch(actions.add)}
          background={theme.color.secondary}
        >Add</Button>
      </Box>
      <Card>
        {children}
      </Card>
    </div>
  )
}

const Container = ({ screen }) => {
  return (
    <ActionBar>
      {screen === screens.loading
        ? <Loading />
        : <MainScreen />}
    </ActionBar>
  )
}

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => {
  render(
    <App state={state}>
      <Container screen={state.screen} />
    </App>,
    element
  )
}, err => console.error(err))

/**
 * Scoped updates serve two primary functions:
 * * Keep potentially complex logic away from components
 * * Easier to consume events from certain action streams, such as responding
 * to window or input (mouse/keyboard) events
 */
const isMainScreen = scope(({ screen }) => screen === screens.main)

signal.register(compress({
  [actions.navigate]: (state, screen) => {
    state.screen = screen
    return state
  },
  [actions.add]: isMainScreen((state, event) => {
    state.count += 1
    return state
  })
}))
