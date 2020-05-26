
/**
 * Action names can be passed to streams to key against.
 */

import styled from 'styled-components'
import { css } from '@styled-system/css'
import React, { useState, useCallback } from 'react'
import { render } from 'react-dom'
// import { useMergeRefs } from 'use-callback-ref'

import { Signal } from 'raid'
import { debug } from '@raid/addons/debug'
import { keys } from '@raid/streams/keys'

import { Pane, Box, Text, Image } from '@raid/basic-kit'
import { App, element } from '../_common'

const velocity = 3

const signal = Signal.of({
  positionNick: [10, 10],
  positionBill: [10, 10]
})

signal.register(debug(''))

const calcNewPosition = (keys, oldPosition) => {
  let mx = 0
  let my = 0

  if (keys.has('<up>')) {
    my = -velocity
  }

  if (keys.has('<down>')) {
    my = velocity
  }

  if (keys.has('<left>')) {
    mx = -1
  }

  if (keys.has('<right>')) {
    mx = 1
  }

  return [
    oldPosition[0] + mx,
    oldPosition[1] + my
  ]
}

signal.register((state, event) => {
  if (event.type === 'nick:press') {
    const position = calcNewPosition(event.payload.keys, state.positionNick)
    return {
      ...state,
      positionNick: position
    }
  }

  if (event.type === 'bill:press') {
    const position = calcNewPosition(event.payload.keys, state.positionBill)
    return {
      ...state,
      positionBill: position
    }
  }

  return state
})

const useFocussedKeys = id => {
  const [isFocussed, setFocussed] = useState(false)
  let subscription = null

  const ref = useCallback(node => {
    if (!node) {
      return
    }

    const setFocus = () => {
      setFocussed(true)
      subscription = signal.mount(keys({
        type: id,
        el: node
      }))
    }
    const setBlur = () => {
      setFocussed(false)
      if (subscription) {
        subscription.unsubscribe()
      }
    }

    node.addEventListener('focus', setFocus)
    node.addEventListener('blur', setBlur)

    return () => {
      node.removeEventListener('focus', setFocus)
      node.removeEventListener('blur', setBlur)
    }
  }, [])

  return [isFocussed, ref]
}

const FocusIndicator = styled(Box)(
  props => css({
    position: 'absolute',
    top: 4,
    right: 4,
    bg: props.isFocussed ? 'positive.400' : 'critical.400',
    transition: 'background 100ms linear',
    height: 2,
    width: 2,
    borderRadius: 'circular',
    borderColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    zIndex: 5
  })
)

const Mover = ({
  id,
  url,
  position
}) => {
  const [isFocussed, ref] = useFocussedKeys(id)

  // ref={useMergeRefs([ref, keyRef])}

  return (
    <Pane
      ref={ref}
      tabIndex={0}
      sx={{ borderBottom: 'light.200', position: 'relative' }}
    >
      <FocusIndicator isFocussed={isFocussed} />
      <Image
        src={url}
        size='100px'
        sx={{
          position: 'absolute',
          top: position[1] + 'px',
          left: position[0] + 'px'
        }}
      />
    </Pane>
  )
}

signal.observe(state => {
  render(
    <App state={state}>
      <Pane>
        <Text block>Focus a pane and hit the arrow keys</Text>
        <Mover
          id='nick'
          url='https://www.placecage.com/200/200'
          position={state.positionNick}
        />
        <Mover
          id='bill'
          url='https://www.fillmurray.com/200/200'
          position={state.positionBill}
        />
      </Pane>
    </App>,
    element
  )
})
