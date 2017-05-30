import { FETCH_PAGES_SUCCESS } from '../constants/actionTypes'
const initialState = []
// test reducer
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PAGES_SUCCESS:
      return action.body
    default:
      return state
  }
}
