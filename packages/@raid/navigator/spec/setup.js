
import { JSDOM } from 'jsdom'

const url = `https://${Math.random().toString(16).split('.')[1]}.example.com`
var dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url
})
global.window = dom.window
global.document = window.document
global.navigator = global.window.navigator
// global.window.sessionStorage = {
//   getItem: () => {console.log('getting'); return null},
//   setItem: () => {}
// }
