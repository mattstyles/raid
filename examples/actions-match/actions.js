
var Box = v => ({
  map: fn => Box(fn(v)),
  ap: b2 => b2.map(v),
  chain: fn => fn(v),
  inspect: () => `Box(${v})`
})

// var Action = function (v) {
//   this.__value = v
// }
//
// Action.of = v => new Action(v)
//
// Action.map = fn => Action.of(fn(this.__value))

// class Action {
//   constructor (v) {
//     this.__value = v
//   }
//   static of (v) {
//     return new Action(v)
//   }
//   static is (type) {
//     return type instanceof Action
//   }
//   map (fn) {
//     return Action.of(fn(this.__value))
//   }
//   join () {
//     return this.__value
//   }
//   chain (fn) {
//     return this.map(fn).join()
//   }
//   ap (a) {
//     return a.map(this.__value)
//   }
// }

// const createAction = name => {
//   return class {
//     constructor (value) {
//       this.meta = {
//         name
//       }
//       this.payload = value
//     }
//     static is (type) {
//       return type.meta.name === name
//     }
//     inspect () {
//       return `${name} (${this.payload.toString()})`
//     }
//   }
// }
export const createAction = name => {
  var action = {[name]: class {
    constructor (value) {
      this.__value = value
    }
    static of (value) {
      return new action[name](value)
    }
    static is (type) {
      return type instanceof action[name]
    }
    map (fn) {
      return action[name].of(fn(this.__value))
    }
    join () {
      return this.__value
    }
    chain (fn) {
      return this.map(fn).join()
    }
    ap (a) {
      return a.map(this.__value)
    }
  }}
  return action[name]
}

// var res = Box(x => y => x + y)
//   .ap(Box(2))
//   .ap(Box(5))

// const a10 = x => Action.of(x + 10)
//
// var res = Action.of(4)
//   .map(x => ++x)
//   .chain(a10)
//   .chain(a10)
//
// var Stuff = createAction('stuff')
// var stuff = new Stuff(' a payload')
// var res = Stuff.is(stuff)
//
// console.log(res)
// console.log(stuff)
