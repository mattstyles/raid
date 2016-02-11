
import React from 'react'
import RenderState from './renderState'
import ActionButton from '../_common/actionButton'
import User from './user'
import store from './store'

const style = {
  container: {
    display: 'flex'
  },
  left: {
    flex: .5,
    boxSizing: 'border-box',
    padding: '1em'
  },
  right: {
    flex: .5,
    boxSizing: 'border-box',
    minHeight: '100vh',
    borderLeft: '1px solid rgb( 232, 232, 232)',
    background: 'rgb( 40, 40, 40 )',
    padding: '1em',
    overflow: 'scroll'
  },
  btn: {
    background: 'rgb( 235, 137, 49 )'
  },
  userContainer: {
    marginTop: 20
  }
}

const onAdd = num => {
  return event => {
    store.add( num )
  }
}

export default props => {
  let users = props.state.map( user => {
    return <User key={ user.get( 'uid' ) } data={ user } />
  })

  return (
    <div style={ style.container }>
      <div style={ style.left }>
        <p>Uses the Raid component pure render function to give a speed boost</p>
        <p>Check the console for output from measuring wasted effort, with the pure render there should be 0 waste, which for large lists is a significant saving</p>
        <p>Number of users: { users.count() }</p>
        <ActionButton onClick={ onAdd( 10 ) }>Add 10</ActionButton>
        <ActionButton onClick={ onAdd( 100 ) }>Add 100</ActionButton>
        <ActionButton onClick={ onAdd( 1000 ) }>Add 1000</ActionButton>
        <div style={ style.userContainer }>
          { users.count() ? users : <p>Loading...</p> }
        </div>
      </div>
      <div style={ style.right }>
        <RenderState />
      </div>
    </div>
  )
}
