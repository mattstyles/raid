
import {createSelector} from 'reselect'
import {Navigator} from 'raid-navigator/src'

import {signal, connect} from './store'

export const Navigation = connect(
  createSelector(
    state => state.navigation,
    () => signal,
    (navigation, signal) => ({
      navigation,
      signal
    })
  ),
  Navigator
)
