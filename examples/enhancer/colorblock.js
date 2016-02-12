
/**
 * Example of using the enhancer to generate functions all ready to go
 */

import React, { Component } from 'react'
import Immutable from 'immutable'
import { Enhance } from '../../lib'

import state from './state'


const ColorState = new Immutable.Record({
  r: 0,
  g: 0,
  b: 0
})

const Enhancer = Enhance( state, new ColorState() )


const styles = {
  container: {
    position: 'absolute',
    zIndex: 100,
    right: 5,
    top: 5,
    width: 64,
    height: 64,
    background: 'rgb( 255, 255, 255 )',
    borderRadius: 3,
    cursor: 'pointer'
  },
  color: {
    position: 'absolute',
    left: 4,
    top: 4,
    width: 56,
    height: 56
  }
}
export default Enhancer( class ColorBlock extends Component {
  constructor( props ) {
    super( props )
  }

  onClick = event => {
    this.state.update( cursor => {
      return cursor.merge( new ColorState({
        r: Math.random() * 0xff | 0,
        g: Math.random() * 0xff | 0,
        b: Math.random() * 0xff | 0
      }))
    })
  };

  colorString( col ) {
    return 'rgb(' + [ ...col ].join( ',' ) + ')'
  }

  render() {
    let color = this.state.toList()
    let colorStyle = Object.assign( {}, styles.color, {
      background: this.colorString( color )
    })
    return (
      <div style={ styles.container } onClick={ this.onClick }>
        <div style={ colorStyle }></div>
      </div>
    )
  }
})
