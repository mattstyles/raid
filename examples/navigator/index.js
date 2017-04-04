
import {render} from 'react-dom'

import {Signal} from 'raid/src'
import {Navigator, actions} from 'raid-navigator/src'

import element from '../_common/element'

const signal = new Signal({})

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

signal.register((state, event) => {
  if (event.type === actions.navigate) {
    console.log('navigating', event)
    state.route = event.payload.route
    return state
  }

  return state
})

signal.observe(state => {
  render(
    <Navigator signal={signal} route={state.route}>
      <View route='/'>
        <div>Index</div>
      </View>
      <View route='/home'>
        <div>Home</div>
      </View>
      <View route='/settings'>
        <div>Settings</div>
      </View>
    </Navigator>,
    element
  )
}, err => console.error(err))
