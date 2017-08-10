
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import {
  default as screenStream,
  actions as screenActions
} from 'raid-streams/src/screen'
import {
  default as keyStream,
  actions as keyActions,
  keySequence,
  timedKeySequence
} from 'raid-streams/src/keys'
import {
  default as tickStream,
  actions as tickActions
} from 'raid-streams/src/tick'

import element from '../_common/element'
// import {View, Main, Code} from '../_common/layout'
import {App} from '../_common'

// Create main app signal
const signal = new Signal({
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.screen.orientation.type,
  left: window.scrollX,
  top: window.scrollY,
  frames: 0,
  toggle: false,
  enterDownFor: 0,
  sequence: [],
  timedSequence: [],
  hadoken: false
})

// Apply stream as an input source for the main signal
signal.mount(screenStream())
signal.mount(tickStream())
signal.mount(keyStream())
signal.mount(keySequence())
signal.mount(timedKeySequence({timeout: 500}))

const update = (state, {type, payload}) => {
  if (type === keyActions.timedSequence) {
    state.timedSequence = payload.keys
    state.hadoken = state.timedSequence.join('') === 'ASD<enter>'
    return state
  }

  if (type === keyActions.sequence) {
    state.sequence = payload.keys
    return state
  }

  if (type === keyActions.keydown) {
    state.key = payload.key
    return state
  }

  if (type === keyActions.keyup) {
    if (payload.key === '<enter>') {
      state.enterDownFor = 0
    }
    return state
  }

  if (type === keyActions.keypress) {
    if (payload.keys.has('<enter>')) {
      state.enterDownFor = payload.keys.get('<enter>')
    }
    return state
  }

  if (type === tickActions.tick) {
    state.frames = state.frames + 1
    if (state.frames > 60) {
      state.frames = 0
      state.toggle = !state.toggle
    }
    return state
  }

  if (type === screenActions.resize) {
    state.width = payload.width
    state.height = payload.height
    return state
  }

  if (type === screenActions.orientation) {
    state.orientation = payload.orientation
    return state
  }

  if (type === screenActions.scroll) {
    state.left = payload.left
    state.top = payload.top
    return state
  }

  return state
}

signal.register(update)

signal.observe(state => {
  render(
    <App state={state}>
      <p>Try resizing the screen</p>
      <p>Try changing the orientation</p>
      <p>Try scrolling the screen</p>
      <p>Try holding the enter key</p>
      <div style={{
        width: 48,
        height: 48,
        lineHeight: '48px',
        textAlign: 'center',
        color: 'white',
        background: state.toggle ? 'rgb(109, 170, 44)' : 'rgb(208, 70, 72)'
      }}>{state.frames}</div>
      <p style={{
        color: state.keypress ? 'rgb(117, 113, 97)' : 'rgb(20, 12, 28)'
      }}>{state.key}</p>
      <h1 style={{
        display: state.hadoken ? 'block' : 'none'
      }}>Hadoken</h1>
    </App>,
    element
  )
})
