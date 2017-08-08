/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action functions
 */

import {render} from 'react-dom'
import {Signal} from 'raid/src'
import {union} from 'folktale/adt/union'

import {App, Button, element, theme} from '../_common'

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = new Signal({
  count: 0
})

/**
 * Tagged union for action
 */
const actions = union('actions', {
  alter: value => ({value}),
  reset: () => {}
})

/**
 * This assumes that a folktale tagged union will output something if it
 * does not match, which is currently not the case so whilst this works, it
 * not currently scalable.
 */
const update = (state, event) => {
  return event.matchWith({
    alter: ({value}) => ({
      ...state,
      count: state.count + value
    }),
    reset: () => ({
      ...state,
      count: 0
    }),

    // default not implemented in folktale/union
    _: () => state
  })
}

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = type => event => signal.emit(type)

const Counter = ({count}) => {
  return (
    <div className='Counter'>
      <span className='Count'>{count}</span>
      <div className='Controls'>
        <Button
          onClick={dispatch(actions.alter(1))}
        >+</Button>
        <Button
          onClick={dispatch(actions.alter(-1))}
        >-</Button>
        <Button
          onClick={dispatch(actions.reset())}
          background={`${theme.color.secondary}`}
        >Reset</Button>
      </div>
      <style jsx>{`
        .Counter {
          display: inline-block;
          padding: 8px 0px 8px 8px;
          background: rgb(255, 255, 255);
          border: 1px solid rgb(230,232,238);
          border-radius: 3px;
        }
        .Count {
          display: inline-block;
          font-size: 28px;
          margin: 0px 16px 0px 8px;
          vertical-align: middle;
        }
        .Controls {
          display: inline-block;
        }
      `}</style>
    </div>
  )
}

/**
 * The signal observer notifies when the application state changes
 */
signal.observe(state => {
  render(
    <App state={state}>
      <Counter count={state.count} />
    </App>,
    element
  )
}, error => console.error(error))

/**
 * Register updates.
 * Returns a dispose function which can be used to destroy an update function.
 */
signal.register(update)
