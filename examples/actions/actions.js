
import state from './state'

export const ACTIONS = {
  ADD: 'actions:add',
  SUBTRACT: 'actions:subtract'
}

state.register( dispatch => {
  if ( dispatch.type === ACTIONS.ADD ) {
    let counters = state.cursor([ 'app', 'counters' ])
    let index = counters.findIndex( counter => {
      return counter.get( 'id' ) === dispatch.id
    })
    let counter = counters.cursor( index )

    counter.update( cursor => {
      let count = cursor.get( 'count' )
      return cursor.merge({
        count: ++count
      })
    })

    return
  }

  if ( dispatch.type === ACTIONS.SUBTRACT ) {
    let counters = state.cursor([ 'app', 'counters' ])
    let index = counters.findIndex( counter => {
      return counter.get( 'id' ) === dispatch.id
    })
    let counter = counters.cursor( index )

    counter.update( cursor => {
      let count = cursor.get( 'count' )
      return cursor.merge({
        count: --count
      })
    })

    return
  }

  return
})
