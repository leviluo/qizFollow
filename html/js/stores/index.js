import { createStore, applyMiddleware,compose } from 'redux'
import quotesApp from '../reducers'
import thunkMiddleware from 'redux-thunk'
import api from '../middleware/api'

let createStoreWithMiddleware = applyMiddleware(thunkMiddleware, api)(createStore)

const store = createStoreWithMiddleware(quotesApp)

export default store
