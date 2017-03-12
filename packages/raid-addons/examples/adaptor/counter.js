
import {createSelector} from 'reselect'

import Button from '../_common/actionButton'
import {connect} from './store'
import {ACTIONS, dispatch} from './actions'

const styles = {
  counter: {
    display: 'inline-block',
    padding: '8px 0px 8px 8px',
    background: 'rgb(255, 255, 255)',
    border: '1px solid rgb(230,232,238)',
    borderRadius: '3px'
  },
  count: {
    display: 'inline-block',
    fontSize: '28px',
    margin: '0px 16px 0px 8px',
    verticalAlign: 'middle'
  },
  counterControls: {
    display: 'inline-block'
  }
}

const Counter = ({count}) => {
  return (
    <div style={styles.counter}>
      <span style={styles.count}>{count}</span>
      <div style={styles.counterControls}>
        <Button
          onClick={dispatch(ACTIONS.ADD)}
        >+</Button>
        <Button
          onClick={dispatch(ACTIONS.SUBTRACT)}
        >-</Button>
      </div>
    </div>
  )
}

const selector = createSelector(
  state => state.count,
  count => ({count})
)
export default connect(selector, Counter)
