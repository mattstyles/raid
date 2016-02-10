
/**
 * Example of using the enhancer to generate functions all ready to go
 */

import React, { Component } from 'react'
import Immutable from 'immutable'
import { Enhance } from '../../lib'

import ActionButton from '../_common/actionButton'
import state from './state'
import { generateName, generateImage } from './cache'


const UserState = new Immutable.Record({
  name: generateName(),
  url: generateImage()
})

const Enhancer = Enhance( state, new UserState() )


const styles = {
  container: {
    margin: '12px auto',
    padding: 24,
    background: 'rgb( 255, 255, 255 )',
    borderRadius: 3,
    border: '1px solid rgb( 232, 232, 232 )',
    width: '100%',
    maxWidth: 360
  },
  name: {
    fontSize: 18,
    lineHeight: 2,
    margin: '12px auto',
    textAlign: 'center'
  },
  image: {
    display: 'block',
    borderRadius: 200,
    width: 64,
    height: 64,
    margin: '12px auto'
  },
  btn: {
    width: '100%'
  }
}
export default Enhancer( class User extends Component {
  constructor( props ) {
    super( props )
  }

  onGenerate = event => {
    this.props.state.update( cursor => {
      return cursor.merge( new UserState({
        name: generateName(),
        url: generateImage()
      }))
    })
  };

  render() {
    let image = this.props.state.get( 'url' )
      ? <img src={ this.props.state.get( 'url' ) } style={ styles.image } />
      : ''

    return (
      <div style={ styles.container }>
        { image }
        <h1 style={ styles.name }>{ this.props.state.get( 'name' ) }</h1>
        <ActionButton
          styles={ styles.btn }
          onClick={ this.onGenerate }
        >Generate</ActionButton>
      </div>
    )
  }
})
