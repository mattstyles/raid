
import { createSelector } from 'reselect'

import { connect } from './store'

import { P } from '../_common'

const Flex = ({ width, height }) => <P>{`[${width}, ${height}]`}</P>

export default connect(
  createSelector(
    state => state.width,
    state => state.height,
    (width, height) => ({ width, height })
  ),
  Flex
)
