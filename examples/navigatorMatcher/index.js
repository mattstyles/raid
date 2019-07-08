
import { render } from 'react-dom'

import { RouteMatcher } from 'raid-navigator'
import { Navigation, Push, Back, Forward } from './navigation'
import { signal } from './store'

import { element, App, Card } from '../_common'

const View = ({ children, params, route }) => {
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
      <Push route='/foo'>Unmatched</Push>
      <Navigation>
        <View route='/'>
          <h1>Index</h1>
          <Push route='/home/foo'>Home/foo</Push>
          <Push route='/home/bar'>Home/bar</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/home/foo'>
          <h1>Home/foo</h1>
          <Push route='/home/bar'>Home/bar</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/home/bar'>
          <h1>home/bar</h1>
          <Push route='/home/foo'>Home/foo</Push>
          <Push route='/settings'>Settings</Push>
        </View>
        <View route='/settings'>
          <h1>Settings</h1>
          <Push route='/'>Index</Push>
          <Push route='/home/foo'>Home/foo</Push>
          <Push route='/home/bar'>Home/bar</Push>
        </View>
      </Navigation>
      <Card>
        <RouteMatcher navigation={state.navigation}>
          <div route='/home/*'>Matched on home</div>
          <div route='/settings/*'>Matched on settings</div>
        </RouteMatcher>
      </Card>
    </App>,
    element
  )
}, err => console.error(err))
