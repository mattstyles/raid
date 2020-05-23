/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import { render } from 'react-dom'
import styled from 'styled-components'

import { Signal } from 'raid'

import { Box, Spacer, Button, Pre } from '@raid/basic-kit'
import { App, element } from '../_common'

var line = '........................................'

const generateLine = char => {
  if (char) {
    return line.replace(/\./g, char)
  }

  var output = line.replace(/\./g, ch => {
    return Math.random() > 0.7 ? '#' : ' '
  })
  return output
    .replace(/^./, '#')
    .replace(/.$/, '#')
}

const generateMap = () => {
  var arr = []
  arr.push(generateLine('#'))
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine())
  arr.push(generateLine('#'))
  return arr.join('')
}

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = new Signal({
  map: generateMap()
})

/**
 * Action enum gives the updates a key to perform mutations
 */
const actions = {
  generate: 'actions:generate'
}

/**
 * updates are responsible for mutating state and returning it.
 * They can be composed to provide more complex state manipulation.
 */
const update = (state, event) => {
  if (event.type === actions.generate) {
    state.map = generateMap()
    return state
  }

  return state
}

const dispatch = type => event => {
  signal.emit({ type })
}

const Grid = styled(Pre)({
  background: 'hsl(0, 4%, 6%)',
  color: 'hsl(204, 26%, 94%)',
  fontWeight: 700,
  fontSize: 20
})

const Line = ({ str }) => <div>{str}</div>

const Map = ({ map }) => {
  const content = []
  for (let i = 0; i < 20; i++) {
    content.push(map.slice(i * 40, (i + 1) * 40))
  }
  return (
    <Box>
      <Grid inset>
        {content.map((str, i) => <Line key={i} str={str} />)}
      </Grid>
      <Spacer py={2} />
      <Button
        variant='primary'
        onClick={dispatch(actions.generate)}
      >
        Generate
      </Button>
    </Box>
  )
}

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => render(
  <App state={state}>
    <Map map={state.map} />
  </App>,
  element
))

/**
 * Register updates.
 * Returns a dispose function which can be used to destroy an update function.
 */
signal.register(update)
