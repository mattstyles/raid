
import {render} from 'react-dom'
// import createHistory from 'history/createMemoryHistory'
import createHistory from 'history/createBrowserHistory'

import {Signal} from 'raid/src'
import {adaptor} from 'raid-addons/src'
import {
  Navigator,
  createUpdate,
  initial
} from 'raid-navigator/src'

import element from '../_common/element'

const history = createHistory()
window.appHistory = history

const signal = new Signal({
  ...initial
})
const connect = adaptor(signal)

const Navigation = connect(
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

// Pass history to update function
signal.register(createUpdate(null, history))

// Base debug function
signal.register(state => {
  console.log('>>', state)
  return state
})

signal.observe(state => {
  render(
    <Navigation history={history}>
      <View route='/'>
        <div>Index</div>
      </View>
      <View route='/home'>
        <div>Home</div>
      </View>
      <View route='/settings'>
        <div>Settings</div>
      </View>
    </Navigation>,
    element
  )
}, err => console.error(err))
