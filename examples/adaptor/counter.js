
import {createSelector} from 'reselect'

import {Button, theme} from '../_common'
import {connect} from './store'
import {ACTIONS, dispatch} from './actions'

const Counter = ({count}) => {
  return (
    <div className='counter'>
      <span className='count'>{count}</span>
      <div className='controls'>
        <Button
          onClick={dispatch(ACTIONS.ADD)}
        >+</Button>
        <Button
          onClick={dispatch(ACTIONS.SUBTRACT)}
        >-</Button>
      </div>
      <style jsx>{`
        .counter {
          display: inline-block;
          /*padding: 8px 0px 8px 8px;*/
          padding: ${theme.basePadding * 0.75}rem;
          background: ${theme.color.white};
          border: 1px solid rgb(230, 232, 238);
          border-radius: ${theme.borderRadius}px;
        }
        .count {
          display: inline-block;
          font-size: ${theme.baseFontSize * 2.2}rem;
          margin: 0px ${theme.basePadding}rem 0px ${theme.basePadding * 0.5}rem;
          vertical-align: middle;
          min-width: 6rem;
          text-align: right;
        }
        .controls {
          display: inline-block;
          vertical-align: middle;
        }
      `}</style>
    </div>
  )
}

const selector = createSelector(
  state => state.count,
  count => ({count})
)
export default connect(selector, Counter)
