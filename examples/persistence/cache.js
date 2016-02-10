
/**
 * Data cached from a call to http://api.randomuser.me/?results=25
 */

import { results } from './data.json'

function rand() {
  return results[ Math.random() * results.length | 0 ].user
}

export const generateName = () => {
  return rand().name.first + ' ' + rand().name.last
}

export const generateImage = () => {
  return rand().picture.thumbnail
}
