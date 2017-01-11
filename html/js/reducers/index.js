import auth from './modules/auth';
import * as reducers from './modules/fetchSecretQuote';
import { combineReducers } from 'redux'
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-async-connect'
// 拼装器
const quotesApp = combineReducers({
  auth,
  reduxAsyncConnect,
  ...reducers
})

export default quotesApp