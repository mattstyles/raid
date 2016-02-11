
import React, { Component } from 'react'
import { Record } from 'immutable'
import { Enhance } from '../../lib'
import state from './state'

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: 90,
    background: 'rgb( 255, 255, 255 )',
    borderRadius: 3,
    border: '1px solid rgb( 232, 232, 232 )',
    padding: 6,
    margin: 3,
    cursor: 'pointer'
  },
  image: {
    borderRadius: 200,
    width: 44,
    height: 44,
    margin: '0 auto',
    display: 'block'
  },
  name: {
    margin: '7px 0 0',
    fontSize: 11,
    lineHeight: 1,
    textAlign: 'center'
  }
}

// This is internal state, only the component knows about it
const UserModel = new Record({
  selected: false
})

const Enhancer = Enhance( state, new UserModel() )

export default Enhancer( class User extends Component {
  constructor( props ) {
    super( props )
  }

  shouldComponentUpdate( next ) {
    return !this.props.data.equals( next.data )
  }

  onClick = event => {
    this.state.cursor( 'selected' ).update( cursor => !cursor )
  };

  render() {
    const background = this.state.get( 'selected' )
      ? 'rgb( 178, 220, 239 )'
      : 'rgb( 255, 255, 255 )'

    return (
      <div
        style={ Object.assign( {}, styles.container, { background: background } ) }
        onClick={ this.onClick }
      >
        <img style={ styles.image } src={ this.props.data.get( 'image' ) } />
        <h3 style={ styles.name }>{ this.props.data.get( 'name' ) }</h3>
      </div>
    )
  }
})
