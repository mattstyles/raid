
import { createActions } from '@raid/navigator'
import { createMemoryHistory } from 'history'
import { get } from 'lodash/fp'

export { routes } from './routes'

export const history = createMemoryHistory()
export const actions = createActions(history)

export const events = {
  push: 'navigation:push',
  pop: 'navigation:pop'
}

export const push = ({
  route
}) => {
  actions.push(route)
}

export const pop = () => {
  actions.back()
}

export const getNavigation = get('navigation')
