
import { createSelector } from 'reselect'

import { connect } from './store'

const Message = ({ msg, id }) => {
  return (
    <div>
      <h1>{`${msg} ${id}`}</h1>
    </div>
  )
}

const selector = createSelector(
  state => state.name,
  name => ({ id: name })
)

export default connect(selector, Message)
