
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import {adaptor} from 'raid-addons/src'
import {
  Navigator,
  update,
  initial
} from 'raid-navigator/src'

import element from '../_common/element'

const signal = new Signal({
  ...initial
})
const connect = adaptor(signal)

const Nav = connect(
  state => ({
    navigation: state.navigation,
    signal
  }),
  Navigator
)

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

signal.register(update)

signal.observe(state => {
  render(
    <Nav>
      <View route='/'>
        <div>Index</div>
      </View>
      <View route='/home'>
        <div>Home</div>
      </View>
      <View route='/settings'>
        <div>Settings</div>
      </View>
    </Nav>,
    element
  )
}, err => console.error(err))
