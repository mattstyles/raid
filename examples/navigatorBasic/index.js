
import {render} from 'react-dom'
import {
  push,
  back,
  forward,
  update
} from 'raid-navigator/src'

import {Navigation} from './navigation'
import {signal} from './store'

window.actions = {push, back, forward}

import element from '../_common/element'

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

// Pass history to update function
signal.register(update)

// Base debug function
signal.register(state => {
  console.log('>>', state)
  return state
})

signal.observe(state => {
  render(
    <Navigation>
      <View route='/'>
        <h1>Index</h1>
      </View>
      <View route='/home'>
        <h1>Home</h1>
      </View>
      <View route='/settings'>
        <h1>Settings</h1>
      </View>
    </Navigation>,
    element
  )
}, err => console.error(err))
