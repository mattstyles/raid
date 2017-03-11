/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import {render} from 'inferno-dom'

import {Signal} from 'raid/src'

import element from '../_common/element'
import Button from '../_common/actionButton'
import {View, Main, Code} from '../_common/layout'

var LINE = '........................................'

const generateLine = char => {
  if (char) {
    return LINE.replace(/\./g, char)
  }

  var output = LINE.replace(/\./g, ch => {
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
const ACTIONS = {
  GENERATE: 'actions:generate'
}

/**
 * updates are responsible for mutating state and returning it.
 * They can be composed to provide more complex state manipulation.
 */
const update = (state, event) => {
  if (event.type === ACTIONS.GENERATE) {
    state.map = generateMap()
    return state
  }

  return state
}

/**
 * Raid can be used with any view library
 */
const styles = {
  grid: {
    fontFamily: 'DejaVu Sans Mono',
    fontSize: 15,
    whiteSpace: 'pre',
    color: 'rgb(232, 232, 232)',
    background: 'rgb(24, 24, 24)'
  }
}

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = type => {
  return event => {
    signal.emit({type})
  }
}

const Line = ({str}) => {
  return <div>{str}</div>
}

const Map = ({map}) => {
  let content = []
  for (let i = 0; i < 20; i++) {
    content.push(map.slice(i * 40, (i + 1) * 40))
  }
  return (
    <div>
      <div style={styles.grid}>
        {content.map(str => <Line str={str} />)}
      </div>
      <Button
        styles={{marginTop: 8}}
        onClick={dispatch(ACTIONS.GENERATE)}
      >Generate</Button>
    </div>
  )
}

const App = ({state}) => {
  return (
    <View>
      <Main>
        <Map map={state.map} />
      </Main>
    </View>
  )
}

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => {
  render(
    <App state={state} />,
    element
  )
})

/**
 * Register updates.
 * Returns a dispose function which can be used to destroy an update function.
 */
signal.register(update)
