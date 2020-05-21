
import React from 'react'
import { createSelector } from 'reselect'
import { Navigator, push, back, forward, actions } from '@raid/navigator'
import { safe, compress } from '@raid/addons'
import { TransitionGroup } from 'react-transition-group'

import { Button } from '../_common'
import { signal, connect } from './store'

export const Navigation = connect(
  createSelector(
    state => state.navigation,
    state => state.transition,
    (navigation, transition) => ({
      navigation,
      signal,
      Component: TransitionGroup,
      ComponentProps: {
        childFactory: child => {
          return React.cloneElement(child, {
            transition
          })
        }
      }
    })
  ),
  Navigator
)

export const Push = ({
  children,
  route,
  state,
  transition
}) => (
  <Button onClick={event => push(route, state, transition)}>
    {children}
  </Button>
)

const NavButton = ({ children, onClick, disabled }) => (
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
  ({ navigation }) => ({ navigation }),
  ({ children, navigation }) => {
    const { index } = navigation
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
  ({ navigation }) => ({ navigation }),
  ({ children, navigation }) => {
    const { stack, index } = navigation
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

export const update = compress({
  [actions.push]: safe((state, event) => ({
    ...state,
    transition: event.transition
  })),
  [actions.pop]: safe((state, event) => ({
    ...state,
    transition: 'popping'
  }))
})
