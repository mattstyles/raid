
import { render } from 'react-dom'

import { Signal } from 'raid'
import {
  scope, compress, adaptor, debug
} from '@raid/addons'

import {
  Box, Flex, Spacer, Card, Button, Text
} from '@raid/basic-kit'
import {
  App, element
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
  <Box>
    <Text block>Clicking add will dispatch an event here, but it will not match in the updater.</Text>
  </Box>
)

const MainScreen = connect(
  ({ count }) => ({ count }),
  ({ count }) => (
    <Box>
      <Text block>The updater can access state and realise it should respond to add events.</Text>
      <Spacer py={2} />
      <Text block size='xl' fontWeight={700}>{count}</Text>
    </Box>
  )
)

const ActionBar = ({ children }) => {
  return (
    <Box>
      <Flex row>
        <Button onClick={navigateTo(screens.loading)}>Loading</Button>
        <Spacer px={2} />
        <Button onClick={navigateTo(screens.main)}>Main</Button>
        <Spacer px={2} />
        <Button
          onClick={dispatch(actions.add)}
          background='primary'
        >Add
        </Button>
      </Flex>
      <Spacer py={2} />
      <Card>
        {children}
      </Card>
    </Box>
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
const isMainScreen = scope((state) => state.screen === screens.main)

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

signal.register(debug(''))
