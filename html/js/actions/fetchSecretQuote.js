import { CALL_API } from '../middleware/api'
import * as object from '../constants'

export function closeTips() {
  return {
      type: object.tips_STOP
  }
}

export function openTips(text) {
  return {
      type: object.tips_START,
      response:{msg:text}
  }
}

// 获取私密数时带上认证结果。将在fetch时带着token头
export function fetchSecretQuote(url) {
  // console.log('actionactionactionactionactionaction')
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.QUOTE_REQUEST, object.QUOTE_SUCCESS, object.QUOTE_FAILURE]
    }
  }
}

export function fetchDataQuote(url) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.DataQuote_REQUEST, object.DataQuote_SUCCESS, object.DataQuote_FAILURE]
    }
  }
}

export function fetchFuturesQuote(url) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchFuturesQuote_REQUEST, object.fetchFuturesQuote_SUCCESS, object.fetchFuturesQuote_FAILURE]
    }
  }
}

export function fetchHostFuturesQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchHostFuturesQuote_REQUEST, object.fetchHostFuturesQuote_SUCCESS, object.fetchHostFuturesQuote_FAILURE],
      body:body
    }
  }
}

export function fetchAccountFollowsQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchAccountFollowsQuote_REQUEST, object.fetchAccountFollowsQuote_SUCCESS, object.fetchAccountFollowsQuote_FAILURE],
      body:body
    }
  }
}

export function fetchFollowFuturesQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchFollowFuturesQuote_REQUEST, object.fetchFollowFuturesQuote_SUCCESS, object.fetchFollowFuturesQuote_FAILURE],
      body:body
    }
  }
}

export function fetchAccountsQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchAccountsQuote_REQUEST, object.fetchAccountsQuote_SUCCESS, object.fetchAccountsQuote_FAILURE],
      body:body
    }
  }
}

export function fetchFuturesAddrsQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchFuturesAddrsQuote_REQUEST, object.fetchFuturesAddrsQuote_SUCCESS, object.fetchFuturesAddrsQuote_FAILURE],
      body:body
    }
  }
}

export function operateDataQuote(url,body,update) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.operateDataQuote_REQUEST, object.tips_START, object.operateDataQuote_FAILURE],
      body:body,
      update:update
    }
  }
}

export function fetchConfigsDataQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchConfigsDataQuote_REQUEST, object.fetchConfigsDataQuote_SUCCESS, object.fetchConfigsDataQuote_FAILURE],
      body:body,
    }
  }
}


export function fetchGroups(url) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      types: [object.fetchGroups_REQUEST, object.fetchGroups_SUCCESS, object.fetchGroups_FAILURE],
    }
  }
}

export function fetchGroupRelations(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      body:body,
      types: [object.fetchGroupRelations_REQUEST, object.fetchGroupRelations_SUCCESS, object.fetchGroupRelations_FAILURE],
    }
  }
}

export function fetchContractFilterQuote(url,body) {
  return {
    [CALL_API]: {
      endpoint: url,
      authenticated: true,
      body:body,
      types: [object.fetchContractFilter_REQUEST, object.fetchContractFilter_SUCCESS, object.fetchContractFilter_FAILURE],
    }
  }
}
