import { combineReducers } from 'redux'
import { reducer as toastrReducer } from 'react-redux-toastr'
import pageReducer from './greenhouseReducer'

// creates root reducer
const rootReducer = combineReducers({
  toastr: toastrReducer,
  pages: pageReducer
})

// exports root reducer
export default rootReducer
