
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import {
  default as screenEvents,
  actions as screenActions
} from 'raid-streams/src/screen'
import {
  default as keyEvents,
  actions as keyActions,
  keystream,
  tickstream
} from 'raid-streams/src/keys'

import element from '../_common/element'
import {View, Main, Code} from '../_common/layout'

// Create main app signal
const signal = new Signal({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.screen.orientation.type,
  left: window.scrollX,
  top: window.scrollY
})

// Apply stream as an input source for the main signal
signal.mount(screenEvents())
// signal.mount(keyEvents())
signal.mount(keystream())
// signal.mount(tickstream())

const update = (state, event) => {
  console.log(event)

  if (event.type === screenActions.resize) {
    state.width = event.width
    state.height = event.height
    return state
  }

  if (event.type === screenActions.orientation) {
    state.orientation = event.orientation
    return state
  }

  if (event.type === screenActions.scroll) {
    state.left = event.left
    state.top = event.top
    return state
  }

  return state
}

signal.register(update)

const App = ({state}) => {
  return (
    <View>
      <Main styles={{fontSize: 15, height: '200vh'}}>
        <p>Try resizing the screen</p>
        <p>Try changing the orientation</p>
        <p>Try scrolling the screen</p>
      </Main>
      <Code styles={{width: '120vw'}}>
        <pre>{JSON.stringify(state, null, '  ')}</pre>
      </Code>
    </View>
  )
}

signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
})
