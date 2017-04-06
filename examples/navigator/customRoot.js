
import {render} from 'react-dom'
import {createSelector} from 'reselect'

import {Signal} from 'raid/src'
import {adaptor} from 'raid-addons/src'
import {
  Navigator,
  createUpdate,
  setInitial,
  selector
} from 'raid-navigator/src'

import element from '../_common/element'

const signal = new Signal({
  ...setInitial('_navigation')
})
const connect = adaptor(signal)

/**
 * Selector can be used to customise the state root
 */
const Navigation = connect(
  createSelector(
    selector('_navigation'),
    () => signal,
    (nav, signal) => ({
      _navigation: nav,
      signal
    })
  ),
  Navigator
)

const View = ({children, params, route}) => {
  console.log('params:', params)
  console.log('route:', route)
  return children
}

// signal.register(update)
signal.register(createUpdate('_navigation'))
signal.register(state => {
  console.log('>>', state)
  return state
})

signal.observe(state => {
  render(
    <Navigation root='_navigation'>
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
