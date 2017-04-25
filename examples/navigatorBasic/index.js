
import {render} from 'react-dom'
// import {update} from 'raid-navigator/src'
// import {Navigator} from 'raid-navigator/src'

import {Navigation, Push, Back, Forward} from './navigation'
import {signal} from './store'

import {element, App} from '../_common'

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children.length ? <div>{children}</div> : children
}

// Pass history to update function
// signal.register(update)

// Base debug function
signal.register((state, event) => {
  console.log('>>', event)
  console.log('  ', state)
  console.log('<<')
  return state
})

// const Forward = () => <span />
// const Back = () => <span />
// const Push = () => <span />

signal.observe(state => {
  console.log('state', state)
  render(
    <App state={state}>
      <Back />
      <Forward />
      <Navigation>
        <View route='/'>
          <h1>Index</h1>
          <Push route='/home'>Home</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/home'>
          <h1>Home</h1>
          <Push route='/'>Index</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/settings'>
          <h1>Settings</h1>
          <Push route='/'>Index</Push>
          <Push route='/home'>Home</Push>
        </View>
      </Navigation>
    </App>,
    element
  )
}, err => console.error(err))
