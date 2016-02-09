
var el = document.createElement( 'div' )
Object.assign( el.style, {
  fontFamily: 'Helvetica Neue, Arial, sans-serif',
  webkitFontSmoothing: 'antialiased',
  color: 'rgb( 64, 64, 64 )',
  background: 'rgb( 244, 244, 244 )',
  padding: '24px',
  margin: 0,
  minHeight: '100vh'
})
document.body.appendChild( el )
Object.assign( document.body.style, {
  margin: 0
})

export default el
