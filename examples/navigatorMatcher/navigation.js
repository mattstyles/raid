
import {createStructuredSelector} from 'reselect'
import {Navigator, push, back, forward, RouteMatcher as Matcher} from 'raid-navigator/src'

import {Button} from '../_common'
import {signal, connect} from './store'

export const Navigation = connect(
  createStructuredSelector({
    navigation: state => state.navigation,
    signal: () => signal
  }),
  Navigator
)

export const RouteMatcher = connect(
  createStructuredSelector({
    navigation: state => state.navigation
  }),
  Matcher
)

export const Push = ({children, route, state}) => (
  <Button onClick={event => push(route, state)}>
    {children}
  </Button>
)

const NavButton = ({children, onClick, disabled}) => (
  <Button
    styles={disabled
      ? {
        background: 'rgb(255, 255, 255)',
        color: 'rgb(232, 234, 238)'
      }
      : {
        background: 'rgb(255, 255, 255)',
        color: 'rgb(64, 64, 64)'
      }
    }
    onClick={onClick}
  >{children}</Button>
)

export const Back = connect(
  ({navigation}) => ({navigation}),
  ({children, navigation}) => {
    const {index} = navigation
    const disabled = index === 0
    return (
      <NavButton
        disabled={disabled}
        onClick={event => {
          if (disabled) return
          back()
        }
      }>{'<'}</NavButton>
    )
  }
)

export const Forward = connect(
  ({navigation}) => ({navigation}),
  ({children, navigation}) => {
    const {stack, index} = navigation
    const disabled = index === stack.length - 1
    return (
      <NavButton
        disabled={disabled}
        onClick={event => {
          if (disabled) return
          forward()
        }
      }>{'>'}</NavButton>
    )
  }
)
