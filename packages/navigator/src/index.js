
import {getHistory} from './history'
import Navigator from './navigator'
import {createUpdate, setInitial} from './update'

export {default as Navigator} from './navigator'
export {
  actions,
  back,
  forward,
  push,
  go
} from './actions'
export {
  initial,
  setInitial,
  update,
  createUpdate,
  selector
} from './update'

export const init = ({signal, history, key, storage}) => {
  if (!signal) {
    throw new Error('Navigator requires a signal to operate with')
  }

  history = history || getHistory()
  storage = storage || window.sessionStorage
  return {
    history,
    update: createUpdate({
      history,
      storage
    }),
    initial: setInitial({key, storage, history}),
    actions: {
      back: history.goBack,
      forward: history.goForward,
      push: history.push,
      go: history.go
    },
    // This expects navigation stack to be passed so its not quite as
    // automatic as desired
    Navigator: ({children, navigation}) => {
      return (
        <Navigator
          signal={signal}
          history={history}
          root={key}
          navigation={navigation}
        >
          {children}
        </Navigator>
      )
    }
  }
}
