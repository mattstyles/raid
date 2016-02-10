
/**
 * Standard button
 */
import React from 'react'

const styles = {
  padding: '.85em 1.33em',
  borderRadius: 3,
  border: 'none',
  background: 'rgb( 49, 162, 242 )',
  color: 'rgb( 249, 249, 249 )',
  fontSize: 16,
  lineHeight: 1,
  fontWeight: 400,
  textShadow: '0px 1px 1px rgba( 0, 0, 0, .25 )',
  marginRight: '.5em',
  cursor: 'pointer'
}

export default props => {
  return (
    <button
      style={ Object.assign( {}, styles, {
        background: props.background || styles.background
      }, props.styles ) }
      onClick={ props.onClick }
    >
      { props.children }
    </button>
  )
}
