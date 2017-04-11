
import {render} from 'react-dom'
// import createHistory from 'history/createMemoryHistory'
import createHistory from 'history/createBrowserHistory'

import {Signal} from 'raid/src'
import {
  init,
  initial
} from 'raid-navigator/src'

import element from '../_common/element'

const history = createHistory()
window.appHistory = history

const signal = new Signal({
  ...initial
})

const {Navigator, update, actions} = init({signal, history})
window.actions = actions

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

// Pass history to update function
// signal.register(createUpdate(null, history))
signal.register(update)

// Base debug function
signal.register(state => {
  console.log('>>', state)
  return state
})

signal.observe(state => {
  render(
    <Navigator navigation={state.navigation}>
      <View route='/'>
        <h1>Index</h1>
      </View>
      <View route='/home'>
        <h1>Home</h1>
      </View>
      <View route='/settings'>
        <h1>Settings</h1>
      </View>
    </Navigator>,
    element
  )
}, err => console.error(err))
