
import axios from 'axios'

import {
  arc,
  flow,
  compress
} from '../../src'

import {dispatch, actions} from './actions'

const onPending = dispatch(actions.requestPending)
const onSuccess = dispatch(actions.requestSuccess)
const onFailure = dispatch(actions.requestFailure)

const URL = 'https://api.github.com/users/octocat'
const makeRequest = () => axios.get(URL)
  .then(res => res.data)

const delay = ms => ({
  then: cb => setTimeout(cb, ms)
})

const update = async (state, payload) => {
  onPending()

  try {
    let user = await makeRequest()
    onSuccess(user)
  } catch (err) {
    onFailure(err.message)
  }

  return state
}

const mock = async (state, payload) => {
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
  arc,
  compress(actions.request)
)(process.env.DEBUG ? mock : update)
