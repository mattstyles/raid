
import vkey from 'vkey'
import raf from 'raf-stream'
import {fromEvent, mergeArray, merge} from 'most'

export const actions = {
  keydown: '@@keys:keydown',
  keyup: '@@keys:keyup',
  keypress: '@@keys:keypress'
}

const keymap = type => ({keyCode}) => ({
  key: vkey[keyCode],
  type
})

const exclude = keys => ({key}) => !keys.includes(key)

const keystream = () => {
  const pressed = new Map()

  const keydown = fromEvent('keydown', window)
    .map(keymap(actions.keydown))
    .filter(exclude([
      '<tab>'
    ]))
    .filter(({key}) => !pressed.has(key))
    .tap(({key}) => pressed.set(key, 0))

  const keyup = fromEvent('keyup', window)
    .map(keymap(actions.keyup))
    .filter(exclude([
      '<tab>'
    ]))
    .tap(({key}) => pressed.delete(key))

  const keypress = fromEvent('data', raf(window))
    .filter(dt => pressed.size > 0)
    .tap(dt => {
      for (let [key, value] of pressed) {
        pressed.set(key, value + dt)
      }
    })
    .map(dt => ({
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
