
/**
 * Signals can be mounted in response to elements registering streams with
 * the signal. Streams/element also handles attaching streams to events
 * specific to a DOM element.
 */

import React, { useEffect, useRef } from 'react'
import { render } from 'react-dom'

import { Signal } from 'raid'
import { debug } from '@raid/addons/debug'
import { scroll, actions } from '@raid/streams/element'
import { keys } from '@raid/streams/keys'

import { Box, Spacer, Card, Text, H2, P } from '@raid/basic-kit'
import { App, element } from '../_common'
import { sizeUpdate } from './size'

const signal = Signal.of({
  top: 0,
  width: 200,
  height: 200
})

signal.register(debug(''))

signal.register((state, event) => {
  if (event.type === actions.scroll) {
    return {
      ...state,
      top: event.payload.top
    }
  }

  return state
})

signal.register(sizeUpdate)

const ScrollComponent = ({ top }) => {
  const ref = useRef(null)
  useEffect(() => {
    const subscription = signal.mount(scroll({
      el: ref.current
    }))

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Card sx={{ width: '200px' }}>
      <Text block>{`{ top: ${top} }`}</Text>
      <Spacer py={2} />
      <Box ref={ref} sx={{ height: '160px', overflowY: 'scroll' }}>
        <H2>A heading</H2>
        <P>Try scrolling this element up and down and see how the state object responds to those scroll events.</P>
        <P>Try scrolling this element up and down and see how the state object responds to those scroll events.</P>
        <P>Try scrolling this element up and down and see how the state object responds to those scroll events.</P>
        <P>Try scrolling this element up and down and see how the state object responds to those scroll events.</P>
        <P>Try scrolling this element up and down and see how the state object responds to those scroll events.</P>
      </Box>
    </Card>
  )
}

const SizeComponent = ({ width, height }) => {
  const ref = useRef(null)
  useEffect(() => {
    const subscription = signal.mount(keys({
      el: ref.current
    }))

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <Box>
      <Text block>Focus the pink square and use the arrow keys to resize.</Text>
      <Spacer py={2} />
      <Box
        tabIndex={0}
        ref={ref}
        sx={{
          position: 'relative',
          bg: 'hsl(329, 100%, 54%)',
          width: width,
          height: height
        }}
      />
    </Box>
  )
}

signal.observe(state => {
  render(
    <App state={state}>
      <Card>
        <Text block size='s'>Open the console to see all events passing through the signal.</Text>
      </Card>
      <Spacer py={2} />
      <SizeComponent width={state.width} height={state.height} />
      <Spacer py={2} />
      <ScrollComponent top={state.top} />
    </App>,
    element
  )
})
