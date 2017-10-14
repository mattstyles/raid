/**
 * Basic counter example
 * ---
 * The initial state is populated and its contents are then manipulated directly
 * by action types
 */

import {render} from 'react-dom'
import {Signal} from 'raid/src'
import {connect, typeEvent, untypeEvent} from 'raid-fl/src'
import {match, debug} from 'raid-addons/src'

import {App, Button, element, theme} from '../_common'

/**
 * The main signal can be observed for changes to application state.
 * The signal accepts a parameter which defines the initial state.
 */
const signal = new Signal({
  count: 0
})

const createActions = connect(signal)

/**
 * Create actions
 */
const [alter, reset] = createActions([
  'alter',
  'reset'
])
const regularAction = 'action::stringForm'

/**
 * Update functions
 */
const onAlter = (state, event) => ({
  ...state,
  count: state.count + event.join()
})

const onReset = (state, event) => ({
  ...state,
  count: 0
})

const onRegularAction = (state, event) => {
  console.log('regular action')
  return state
}

const isType = type => event => event['@@type']
  ? type === event['@@type']
  : false

const update = match([
  [alter.is, onAlter],
  [reset.is, onReset],
  [isType(regularAction), onRegularAction]
])

/**
 * Action handlers are a simple bit of sugar to add
 */
const dispatch = type => event => signal.emit({type})

const Counter = ({count}) => {
  return (
    <div className='Counter'>
      <span className='Count'>{count}</span>
      <div className='Controls'>
        <Button
          onClick={event => alter.of(1)}
        >+</Button>
        <Button
          onClick={event => alter.of(-1)}
        >-</Button>
        <Button
          onClick={event => reset.of()}
          background={theme.color.secondary}
        >Reset</Button>
        <Button
          onClick={dispatch(regularAction)}
          background={theme.color.secondary}
        >String Event</Button>
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
const eventStore = {}
signal.register(typeEvent(update, eventStore))
signal.register(untypeEvent((state, event) => {
  console.log('untyped::', event)
  return state
}))

signal.register(debug('>>'))

// signal.register((state, event) => {
//   console.log(state, '::', event)
//   return state
// })
