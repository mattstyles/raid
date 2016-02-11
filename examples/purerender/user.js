
import React, { Component } from 'react'

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: 90,
    background: 'rgb( 255, 255, 255 )',
    borderRadius: 3,
    border: '1px solid rgb( 232, 232, 232 )',
    padding: 6,
    margin: 3
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

export default class User extends Component {
  constructor( props ) {
    super( props )
  }

  shouldComponentUpdate( next ) {
    return !this.props.data.equals( next.data )
  }

  render() {
    return (
      <div style={ styles.container }>
        <img style={ styles.image } src={ this.props.data.get( 'image' ) } />
        <h3 style={ styles.name }>{ this.props.data.get( 'name' ) }</h3>
      </div>
    )
  }
}
