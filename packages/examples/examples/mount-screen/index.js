
/**
 * Example mounting streams from @raid/streams
 */

import { render } from 'react-dom'

import { Signal } from 'raid'
import screenStream, {
  actions as screenActions
} from '@raid/streams/screen'
import keyStream, {
  actions as keyActions,
  keySequence,
  timedKeySequence
} from '@raid/streams/keys'
import tickStream, {
  actions as tickActions
} from '@raid/streams/tick'

import { Text, Box } from '@raid/basic-kit'
import { App, element } from '../_common'

// Create main app signal
const signal = Signal.of({
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

// Apply streams as additional input sources for the main signal
signal.mount(screenStream())
signal.mount(tickStream())
signal.mount(keyStream({
  rate: 1000 / 30
}))
signal.mount(keySequence())
signal.mount(timedKeySequence({ timeout: 500 }))

const update = (state, { type, payload }) => {
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
    console.log(payload.keys)
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
      <Text block>Try resizing the screen</Text>
      <Text block>Try changing the orientation</Text>
      <Text block>Try scrolling the screen</Text>
      <Text block>Try holding the enter key</Text>
      <Box
        size='48px'
        sx={{
          mt: 3,
          bg: state.toggle ? 'positive.500' : 'background.700',
          color: 'white',
          textAlign: 'center',
          lineHeight: '48px'
        }}
      >
        {state.frames}
      </Box>
      <Text block sx={{ color: state.keypress ? 'critical.500' : 'background.700' }}>{state.key}</Text>
      {state.hadoken && <Text block size={8}>HADOKEN!!</Text>}
    </App>,
    element
  )
})

// <div style={{
//   width: 48,
//   height: 48,
//   lineHeight: '48px',
//   textAlign: 'center',
//   color: 'white',
//   background: state.toggle ? 'rgb(109, 170, 44)' : 'rgb(208, 70, 72)'
// }}
// >{state.frames}
// </div>
// <P style={{
//   color: state.keypress ? 'rgb(117, 113, 97)' : 'rgb(20, 12, 28)'
// }}
// >{state.key}
// </P>
// <H1 style={{
//   display: state.hadoken ? 'block' : 'none'
// }}
// >Hadoken
// </H1>
