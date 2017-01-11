import { CALL_API } from '../middleware/api'
import {QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE } from '../constants' 

// dispatch这个action时将调用到中间件
export function fetchQuote(url) {
  return {
    [CALL_API]: {
      endpoint: url,
      types: [QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE]
    }
  }
}
