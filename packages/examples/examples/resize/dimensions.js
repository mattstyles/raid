
import { createSelector } from 'reselect'
import { Text } from '@raid/basic-kit'

import { connect } from './store'

export const Dimensions = connect(
  createSelector(
    state => state.width,
    state => state.height,
    (width, height) => ({ width, height })
  ),
  ({ width, height }) => {
    return (
      <Text block>{`[${width}, ${height}]`}</Text>
    )
  }
)
