
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
  }
}

const onAdd = event => {
  store.add( 20 )
}

export default props => {
  let users = props.state.cursor( 'users' ).map( user => {
    return <User key={ user.get( 'uid' ) } data={ user } />
  })

  return (
    <div style={ style.container }>
      <div style={ style.left }>
        <p>Number of users: { users.count() }</p>
        <ActionButton onClick={ onAdd }>Add</ActionButton>
        { users.count() ? users : <p>Loading...</p> }
      </div>
      <div style={ style.right }>
        <RenderState />
      </div>
    </div>
  )
}
