import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS } from '../../constants'
import Assign from 'Object-assign'

const objectAssign = typeof Object.assign === 'function' ? Object.assign : Assign

// 初始值在localStorage中取得，实际应用中我们也需要检查用户是否失效。login的reducer
export default function auth(state = {
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
  }, action) {
  console.log(action.type)
  switch (action.type) {
    case LOGIN_REQUEST:
      return objectAssign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds
      })
    case LOGIN_SUCCESS:
    // console.log("0000")
      return objectAssign({}, state, {
        isFetching: true,
        isAuthenticated: true,
        errorMessage: ''
      })
    case LOGIN_FAILURE:
      return objectAssign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message
      })
    case LOGOUT_SUCCESS:
      return objectAssign({}, state, {
        isFetching: true,
        isAuthenticated: false
      })
    default:
      return state
  }
}