
import axios from 'axios'

import {
  arc,
  flow,
  compress
} from 'raid-addons/src'

import {signal} from './store'
import {dispatch, actions} from './actions'

const onPending = dispatch(actions.requestPending)
const onSuccess = dispatch(actions.requestSuccess)
const onFailure = dispatch(actions.requestFailure)

const URL = 'https://api.github.com/users/octocat'
const makeRequest = (url) => axios.get(url)
  .then(res => res.data)

const delay = ms => ({
  then: cb => setTimeout(cb, ms)
})

const update = async (getState, payload) => {
  onPending()

  try {
    let user = await makeRequest(URL)
    onSuccess(user)
  } catch (err) {
    onFailure(err.message)
  }
}

const mock = async (getState, payload) => {
  onPending()

  try {
    await delay(1000)
    let user = {
      name: 'Dave',
      image: 'null'
    }
    onSuccess(user)
  } catch (err) {
    onFailure(err.message)
  }
}

// Arc is necessary to ensure state is propagated correctly
// when first firing the updater
export const request = flow(
  arc(signal),
  compress(actions.request)
)(process.env.DEBUG ? mock : update)
