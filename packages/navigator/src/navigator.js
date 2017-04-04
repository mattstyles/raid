
import {history, listener} from './history'

const {Component} = require(`${process.env.BABEL_ENV}/component.js`)
const {createRoute} = require(`${process.env.BABEL_ENV}/routes.js`)

class Navigator extends Component {
  static defaultProps = {
    history: undefined
  }

  componentWillMount () {
    this.history = history(this.props.history)
    this.disposeHistory = this.history
      .listen(listener(this.props.signal))
  }

  componentWillUnmount () {
    if (this.disposeHistory) {
      this.disposeHistory()
    }
  }

  render () {
    const {children, route} = this.props
    const match = createRoute(children, route)
    return (
      <div>{match}</div>
    )
  }
}

export default Navigator
