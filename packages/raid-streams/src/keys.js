
import vkey from 'vkey'
import raf from 'raf-stream'
import {fromEvent, mergeArray, merge} from 'most'

export const actions = {
  keydown: '@@keys:keydown',
  keyup: '@@keys:keyup',
  keypress: '@@keys:keypress',
  sequence: '@@keys:sequence'
}

const keymap = (type, keys) => event => ({
  key: vkey[event.keyCode],
  type,
  keys,
  event
})

const exclude = keys => ({key}) => !keys.includes(key)

const prevent = ({event}) => event.preventDefault()

export const keydown = keys => fromEvent('keydown', window)
  .map(keymap(actions.keydown, keys))
  .filter(exclude([
    '<tab>'
  ]))
  .filter(({key}) => !keys.has(key))
  .tap(({key}) => keys.set(key, 0))
  .tap(prevent)

export const keyup = keys => fromEvent('keyup', window)
  .map(keymap(actions.keyup, keys))
  .filter(exclude([
    '<tab>'
  ]))
  .tap(({key}) => keys.delete(key))
  .tap(prevent)

export const keySequence = (opts = {
  length: 10
}) => {
  const pressed = new Map()

  return merge(
    keydown(pressed),
    keyup(pressed)
  )
    .filter(({type}) => type === actions.keydown)
    .scan((keys, {key}) => {
      return keys
        .concat(key)
        .slice(0 - opts.length)
    }, [])
    .map(keys => ({
      type: actions.sequence,
      keys
    }))
}

const keystream = () => {
  const pressed = new Map()

  const keypress = fromEvent('data', raf(window))
    .filter(dt => pressed.size > 0)
    .tap(dt => {
      for (let [key, value] of pressed) {
        pressed.set(key, value + dt)
      }
    })
    .map(dt => ({
      type: actions.keypress,
      keys: pressed
    }))

  return mergeArray([
    keydown(pressed),
    keyup(pressed),
    keypress
  ])
}

export default keystream
