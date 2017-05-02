
import {render} from 'react-dom'

import {Navigation, Push, Back, Forward} from './navigation'
import {signal} from './store'

import {element, App} from '../_common'

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children.length ? <div>{children}</div> : children
}

// Base debug function
signal.register((state, event) => {
  console.log(event, ':::', state)
  return state
})

signal.observe(state => {
  render(
    <App state={state}>
      <Back />
      <Forward />
      <Navigation>
        <View route='/'>
          <h1>Index</h1>
          <Push route='/home/string'>Home</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/home/:id'>
          <h1>Home</h1>
          <Push route='/'>Index</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/settings'>
          <h1>Settings</h1>
          <Push route='/'>Index</Push>
          <Push route='/home/23'>Home</Push>
        </View>
      </Navigation>
    </App>,
    element
  )
}, err => console.error(err))
