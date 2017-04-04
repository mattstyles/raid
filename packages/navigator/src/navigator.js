
import React, {Component} from 'react'

import {history, listener} from './history'

const createRoutes = child => {
  return React.cloneElement(child, {
    params: 'foo'
  })
}

const filter = route => {
  const re = new RegExp(route)
  return child => re.test(child.props.route)
}

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
    const {children} = this.props
    const routes = React.Children
      .toArray(children)
      .filter(filter(this.props.route))
      .map(createRoutes)
    return (
      <div>{routes}</div>
    )
  }
}

export default Navigator
