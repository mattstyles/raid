
import state from './state'

export const ACTIONS = {
  ADD: 'actions:add',
  SUBTRACT: 'actions:subtract'
}

function getCounter( id ) {
  let counters = state.cursor([ 'app', 'counters' ])
  let index = counters.findIndex( counter => {
    return counter.get( 'id' ) === id
  })
  let counter = counters.cursor( index )

  return counter
}

state.register( dispatch => {
  if ( dispatch.type === ACTIONS.ADD ) {
    let counter = getCounter( dispatch.id )

    counter.update( cursor => {
      let count = cursor.get( 'count' )
      return cursor.merge({
        count: ++count
      })
    })

    return
  }

  if ( dispatch.type === ACTIONS.SUBTRACT ) {
    let counter = getCounter( dispatch.id )

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
