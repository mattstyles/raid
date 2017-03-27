
import {createSelector} from 'reselect'

import {connect} from './store'

const Flex = ({width, height}) => {
  return (
    <div>
      <span>{`[${width}, ${height}]`}</span>
    </div>
  )
}

export default connect(
  createSelector(
    state => state.width,
    state => state.height,
    (width, height) => ({width, height})
  ),
  Flex
)
