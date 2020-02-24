
import { getHistory, createListener } from './history'
import { DEFAULT_KEY, createUpdate } from './update'
import { actions } from './actions'
import { RouteMatcher } from './routeMatcher'

import { useEffect } from './env/react/hooks'

export const Navigator = props => {
  const Route = RouteMatcher(props)
  const { Component, ComponentProps, signal, history, root, storage } = props

  useEffect(() => {
    const disposeHistory = getHistory(history)
      .listen(createListener(signal))

    const disposeUpdate = signal
      .register(createUpdate({
        key: root,
        history,
        signal,
        storage
      }))

    signal.emit({
      type: actions.init
    })

    return () => {
      disposeHistory()
      disposeUpdate()
    }
  }, [
    props.history,
    props.storage
  ])

  return Component
    ? <Component {...ComponentProps}>{Route}</Component>
    : Route
}
Navigator.defaultProps = {
  signal: null,
  history: null,
  root: DEFAULT_KEY,
  navigation: null,
  Component: null,
  ComponentProps: {},
  mapChildren: null
}
