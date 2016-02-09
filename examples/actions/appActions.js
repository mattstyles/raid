
import { Record } from 'immutable'

import state from './state'

/**
 * Counter structure
 */
const Counter = new Record({
  id: id++,
  count: 0
})

/**
 * Top level application actions for adding and removing counters
 */
export const APP_ACTIONS = {
  ADD: 'app:add',
  REMOVE: 'app:remove'
}

/**
 * Global id for referencing each counter, could just as well be a PRNG
 */
var id = 0

/**
 * Register the application actions
 */
state.register( dispatch => {
  if ( dispatch.type === APP_ACTIONS.ADD ) {
    let counters = state.cursor([ 'app', 'counters' ])

    counters.update( cursor => {
      // Using plain JS objects and transforming them is fine
      // return cursor.push( Immutable.fromJS({
      //   id: id++,
      //   count: 0
      // }))

      // Create a new Counter record to push on to the list
      let counter = new Counter({
        id: id++
      })
      return cursor.push( counter )
    })

    return
  }

  if ( dispatch.type === APP_ACTIONS.REMOVE ) {
    let counters = state.cursor([ 'app', 'counters' ])

    counters.update( cursor => {
      return cursor.pop()
    })

    return
  }

  return
})
