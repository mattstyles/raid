
import { Navigator } from '@raid/navigator'

import { connect, signal } from 'signals'
import { routes, history, getNavigation } from 'core/routing'

import { Home } from 'views/home'

const AppNavigation = ({
  navigation
}) => {
  return (
    <Navigator
      signal={signal}
      navigation={navigation}
      history={history}
      storage={null}
    >
      <Home route={routes.home} />
    </Navigator>
  )
}

export const Navigation = connect(
  getNavigation,
  AppNavigation
)
