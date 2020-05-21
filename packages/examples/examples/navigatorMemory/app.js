
import { Navigation, Push, Back, Forward } from './navigation'

import { App } from '../_common'

const View = ({ children, params, route }) => {
  return children.length
    ? <div>{children}</div>
    : children
}

export default ({ state }) => (
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
  </App>
)
