
import {getHistory, createListener} from './history'

const {Component} = require(`${process.env.BABEL_ENV}/component.js`)
const {createRoute} = require(`${process.env.BABEL_ENV}/routes.js`)

class Navigator extends Component {
  static defaultProps = {
    history: undefined
  }

  componentWillMount () {
    this.history = getHistory(this.props.history)
    this.disposeHistory = this.history
      .listen(createListener(this.props.signal))
  }

  componentWillUnmount () {
    if (this.disposeHistory) {
      this.disposeHistory()
    }
  }

  render () {
    const {children, navigation} = this.props
    const {stack, index} = navigation
    const match = createRoute(children, stack[index])
    return (
      <div>{match}</div>
    )
  }
}

export default Navigator
