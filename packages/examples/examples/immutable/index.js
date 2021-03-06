/**
 * Immutable example
 * ---
 * Raid <3's immutable data structures
 */

import { render } from 'react-dom'
import Immutable from 'immutable'

import { Signal } from 'raid'

import { Button } from '@raid/basic-kit'
import { App, element } from '../_common'

const generateShape = () => {
  return {
    left: Math.random() * 90 | 0,
    top: Math.random() * 90 | 0,
    width: Math.random() * 200 | 0,
    height: Math.random() * 200 | 0,
    color: `rgb(${Math.random() * 255 | 0},${Math.random() * 200 | 0},${Math.random() * 200 | 0})`
  }
}

const signal = new Signal(Immutable.List([generateShape()]))

const actions = {
  add: 'action:add'
}

const update = (state, event) => {
  if (event.type === actions.add) {
    return state.push(generateShape())
  }
}

const styles = {
  container: {
    position: 'absolute',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden'
  }
}

const Main = ({ state }) => {
  const shapes = state.toArray().map((shape, i) => {
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: shape.left + '%',
          top: shape.top + '%',
          width: shape.width + 'px',
          height: shape.height + 'px',
          background: shape.color
        }}
      />
    )
  })
  return (
    <div style={styles.container}>
      <div style={{ padding: 12 }}>
        <Button
          variant='primary'
          onClick={e => {
            signal.emit({ type: actions.add })
          }}
        >
          Add
        </Button>
      </div>
      <div style={{ position: 'relative', flex: 1 }}>
        {shapes}
      </div>
    </div>
  )
}

signal.observe(state => {
  render(
    <App state={state}>
      <Main state={state} />
    </App>,
    element
  )
})

signal.register(update)
