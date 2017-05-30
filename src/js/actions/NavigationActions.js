/**
 * @flow
 */
import fetch from 'isomorphic-fetch'
import * as types from '../constants/actionTypes'
// page loading actions
function fetchPagesRequest() {
  return {
    type: types.FETCH_PAGES_REQUEST
  }
}
function fetchPagesSuccess(body) {
  return {
    type: types.FETCH_PAGES_SUCCESS,
    body
  }
}
function fetchPagesFailure(ex) {
  return {
    type: types.FETCH_PAGES_FAILURE,
    ex
  }
}
export function fetchPages(): Function {
  return (dispatch: Function) => {
    dispatch(fetchPagesRequest())
    return fetch('http://localhost:8080/wp-json/wp/v2/pages')
      .then(response => response.json())
      .then(json => dispatch(fetchPagesSuccess(json)))
      .catch(ex => dispatch(fetchPagesFailure(ex)))
  }
}
