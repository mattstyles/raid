
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import {
  default as screenEvents,
  actions as screenActions
} from 'raid-streams/src/screen'

import element from '../_common/element'
import {App} from '../_common/layout'

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

const update = (state, event) => {
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

const View = ({state}) => {
  return (
    <App state={state}>
      <p>Try resizing the screen</p>
      <p>Try changing the orientation</p>
      <p>Try scrolling the screen</p>
      <div style={{height: '200vh'}} />
    </App>
  )
}

signal.observe(state => {
  render(
    <View state={state} />,
    element
  )
})
