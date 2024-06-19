import { fromEvent, mergeArray } from 'most'
import raf from 'raf-stream'
import vkey from 'vkey'

const defaultKeyAction = '@@keys'

export const actions = {
  keydown: '@@keys:down',
  keyup: '@@keys:up',
  keypress: '@@keys:press',
  sequence: '@@keys:sequence',
  timedSequence: '@@keys:timedSequence',
}

const keymap = (type, keys) => (event) => ({
  type,
  payload: {
    key: vkey[event.keyCode],
    keys,
    event,
  },
})

const excludeFn =
  (keys) =>
  ({ payload: { key } }) =>
    !keys.includes(key)
const excludeList = ['<tab>', '<caps-lock>']

const prevent = ({ payload: { event } }) => event.preventDefault()

// @TODO make this work on the server by checking for a global window
export const keydown = (
  keys,
  { el = window, type = actions.keydown, exclude = excludeList } = {},
) =>
  fromEvent('keydown', el)
    .map(keymap(type, keys))
    .filter(excludeFn(exclude))
    .filter(({ payload: { key } }) => !keys.has(key))
    .tap(({ payload: { key } }) => keys.set(key, 0))
    .tap(prevent)

export const keyup = (
  keys,
  { el = window, type = actions.keyup, exclude = excludeList } = {},
) =>
  fromEvent('keyup', el)
    .map(keymap(type, keys))
    .filter(excludeFn(exclude))
    .tap(({ payload: { key } }) => keys.delete(key))
    .tap(prevent)

export const keySequence = ({
  length = 10,
  keys = null,
  type = actions.sequence,
  exclude = excludeList,
} = {}) => {
  const keyMap = keys || new Map()

  return mergeArray([keydown(keyMap, { exclude }), keyup(keyMap, { exclude })])
    .filter(({ type }) => type === actions.keydown)
    .scan((keyMap, { payload: { key } }) => {
      return keyMap.concat(key).slice(0 - length)
    }, [])
    .map((keys) => ({
      type: type,
      payload: {
        keys,
      },
    }))
}

export const timedKeySequence = ({
  length = 10,
  keys = null,
  timeout = 200,
  type = actions.timedSequence,
  exclude = excludeList,
} = {}) => {
  const keyMap = keys || new Map()

  return mergeArray([keydown(keyMap, { exclude }), keyup(keyMap, { exclude })])
    .filter(({ type }) => type === actions.keydown)
    .scan(
      (
        keys,
        {
          payload: {
            key,
            event: { timeStamp },
          },
        },
      ) => {
        return keys
          .concat([[key, timeStamp]])
          .filter(([key, time]) => timeStamp - time < timeout)
          .slice(0 - length)
      },
      [],
    )
    .map((keys) => ({
      type: type,
      payload: {
        keys: keys.map(([key]) => key),
      },
    }))
}

export const keys = ({
  keys = null,
  rate = 0,
  el = window,
  type = defaultKeyAction,
  exclude = excludeList,
} = {}) => {
  const pressed = keys || new Map()

  const keypress = fromEvent('data', raf(el))
    .throttle(rate)
    .filter((dt) => pressed.size > 0)
    .tap((dt) => {
      for (const [key, value] of pressed) {
        if (excludeFn(exclude)({ payload: { key } }))
          pressed.set(key, value + dt)
      }
    })
    .map((dt) => ({
      type: `${type}:press`,
      payload: {
        keys: pressed,
      },
    }))

  return mergeArray([
    keydown(pressed, {
      el: el,
      type: `${type}:down`,
      exclude,
    }),
    keyup(pressed, {
      el: el,
      type: `${type}:up`,
      exclude,
    }),
    keypress,
  ])
}
