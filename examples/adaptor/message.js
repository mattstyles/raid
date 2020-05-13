
import { createSelector } from 'reselect'
import { Box, H1 } from '@raid/basic-kit'

import { connect } from './store'

const Message = ({ msg, id }) => {
  return (
    <Box>
      <H1>{`${msg} ${id}`}</H1>
    </Box>
  )
}

const selector = createSelector(
  state => state.name,
  name => ({ id: name })
)

export default connect(selector, Message)
