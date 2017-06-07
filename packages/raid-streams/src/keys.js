
import vkey from 'vkey'
import raf from 'raf-stream'
import {fromEvent, mergeArray} from 'most'

export const actions = {
  keydown: '@@keys:keydown',
  keyup: '@@keys:keyup',
  keypress: '@@keys:keypress'
}

const keymap = type => ({keyCode}) => ({
  key: vkey[keyCode],
  type
})

const keystream = () => {
  const pressed = new Map()

  const keydown = fromEvent('keydown', window)
    .map(keymap(actions.keydown))
    .filter(({key}) => !pressed.has(key))
    .tap(({key}) => pressed.set(key))

  const keyup = fromEvent('keyup', window)
    .map(keymap(actions.keyup))
    .tap(({key}) => pressed.delete(key))

  const keypress = fromEvent('data', raf(window))
    .filter(event => pressed.size > 0)
    .map(event => ({
      type: actions.keypress,
      pressed
    }))

  return mergeArray([
    keydown,
    keyup,
    keypress
  ])
}

export default keystream
