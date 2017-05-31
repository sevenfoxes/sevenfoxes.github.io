/**
 * @flow
 */
import fetch from 'isomorphic-fetch'
import * as types from '../constants/actionTypes'
// page loading actions
function fetchJobsRequest() {
  return {
    type: types.FETCH_JOBS_REQUEST
  }
}
function fetchJobsSuccess(body) {
  return {
    type: types.FETCH_JOBS_SUCCESS,
    body
  }
}
function fetchJobsFailure(ex) {
  return {
    type: types.FETCH_JOBS_FAILURE,
    ex
  }
}

export function fetchJobs(): Function {
  return (dispatch: Function) => {
    dispatch(fetchJobsRequest())
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => dispatch(fetchJobsSuccess(json)))
      .catch(ex => dispatch(fetchJobsFailure(ex)))
  }
}
