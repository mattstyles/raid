
import {createSelector} from 'reselect'
import {compose} from 'lodash/fp'

import {getHistory, createListener} from './history'
import {DEFAULT_KEY, createUpdate} from './update'
import {actions} from './actions'
import {wrapChildren} from './utils'

const {Component} = require(`${process.env.BABEL_ENV}/component.js`)
const {matchRoute} = require(`${process.env.BABEL_ENV}/routes.js`)

const getProps = createSelector(
  props => props,
  props => props[props.root],
  ({children}, navigation) => ({
    children,
    navigation
  })
)

class Navigator extends Component {
  static defaultProps = {
    signal: null,
    history: null,
    root: DEFAULT_KEY,
    navigation: null
  }

  componentWillMount () {
    const {signal, history, root, storage} = this.props

    this.disposeHistory = getHistory(history).listen(
      createListener(signal)
    )

    this.disposeUpdate = signal.register(createUpdate({
      key: root,
      history,
      signal,
      storage
    }))

    signal.emit({
      type: actions.init
    })
  }

  componentWillUnmount () {
    if (this.disposeHistory) {
      this.disposeHistory()
    }

    if (this.disposeUpdate) {
      this.disposeUpdate()
    }
  }

  render () {
    const {children, navigation} = getProps(this.props)

    if (!navigation) {
      return null
    }

    const {stack, index} = navigation

    if (!stack || !stack.length) {
      return null
    }

    // return wrapChildren(matchRoute(children, stack[index]))
    console.log('returning', matchRoute(stack[index])(children))
    return compose(
      wrapChildren,
      matchRoute(stack[index])
    )(children)
  }
}

export default Navigator
