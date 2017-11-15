
import {render} from 'react-dom'

import {Navigation, Push, Back, Forward, RouteMatcher} from './navigation'
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
      <div className='root'>
        <RouteMatcher>
          <div route='/home/*'>Matched on home</div>
          <div route='/settings/*'>Matched on settings</div>
        </RouteMatcher>
        <style jsx>{`
          div.root {
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 3px;
          }
        `}</style>
      </div>
    </App>,
    element
  )
}, err => console.error(err))
