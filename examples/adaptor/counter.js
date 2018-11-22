
import {createSelector} from 'reselect'

import {Button, Counter, Count, Inline} from '../_common'
import {connect} from './store'
import {ACTIONS, dispatch} from './actions'

const CountWidget = ({count}) => (
  <Counter>
    <Count>{count}</Count>
    <Inline>
      <Button
        onClick={dispatch(ACTIONS.ADD)}
      >+</Button>
      <Button
        onClick={dispatch(ACTIONS.SUBTRACT)}
      >-</Button>
    </Inline>
  </Counter>
)

const selector = createSelector(
  state => state.count,
  count => ({count})
)
export default connect(selector, CountWidget)
