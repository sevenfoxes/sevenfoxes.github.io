import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import greenhouseReducer from './greenhouseReducer'

// creates root reducer
const rootReducer = combineReducers({
  toastr: toastrReducer,
  jobs: greenhouseReducer
})

// exports root reducer
export default rootReducer
