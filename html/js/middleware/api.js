// 公共调用接口

// const BASE_URL = 'http://localhost:50001/'
import { hashHistory } from 'react-router'
export function callApi(endpoint,authenticated,body) {

  let token = localStorage.getItem('id_token') || null
  let config = {}

  if(authenticated) {
    // console.log('credscredscredscredscredscredscredscredscreds')
    if(token) {

      if (body) {
        config = {
        headers: { 'Authorization': `${token}` },
        method:"POST",
        body:body
        }
      } else{
      config = {
        headers: { 'Authorization': `${token}` },
      }
      }

    }
    else {
      alert("No token saved!")
      throw "No token saved!"
    }
  }

  return fetch(endpoint, config)
    .then(response => 
      response.json().then(text => ({ text, response }))
    ).then(({ text, response }) => {
      if (!response.ok) {
        return Promise.reject(text)
      }
      if (text.id == -100) {
        console.log("tiaozhuanle")
        localStorage.removeItem('id_token')
        localStorage.removeItem('userid')
        hashHistory.push('/login')
        return Promise.reject(text)
      };
      return text
    }).catch(err => console.log(err))
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {

  const callAPI = action[CALL_API]

  // 使中间件不会应用到没有CALL_API的action
  if (typeof callAPI === 'undefined') {
    return next(action)
  }

  let { endpoint, types, authenticated,body } = callAPI

  const [ requestType, successType, errorType ] = types

  // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
  // return callApi(endpoint, authenticated,body).then(
  //   response => next({response,authenticated,type: successType}),
  // ).catch(error => next({message: '登录过期或登录发生错误,请重新登陆',type:'LOGIN_FAILURE'}))
  return callApi(endpoint, authenticated,body).then(
    response =>
      next({
        response,
        authenticated,
        type: successType
      }),
    error => next({
      error: error.message || 'There was an error.',
      type: errorType
    })
  )
}
