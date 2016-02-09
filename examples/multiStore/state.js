
import Immreact from '../../lib'

const state = new Immreact.State( 'app', {
  counters: [{
    id: 0,
    count: 0
  }]
})

export default state
