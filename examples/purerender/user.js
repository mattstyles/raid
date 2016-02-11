
import React, { Component } from 'react'


export default class User extends Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
      <div>
        <h3>{ this.props.data.get( 'name' ) }</h3>
      </div>
    )
  }
}
