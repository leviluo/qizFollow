import * as constants from '../../constants'
import Assign from 'Object-Assign'
const objectAssign = typeof Object.Assign === 'function' ? Object.Assign : Assign

export function quotes(state = {
    isFetching: false,
    quote: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.QUOTE_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.QUOTE_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        quote: action.response,
        authenticated: action.authenticated || false
      })
    case constants.QUOTE_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

// The quotes reducer
export function dataQuotes(state = {
    isFetching: false,
    dataQuoteResult: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.DataQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.DataQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        dataQuoteResult: action.response,
        authenticated: action.authenticated || false
      })
    case constants.DataQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false,
        test:action.error
      })
    default:
      return state
    }
}



// The quotes reducer
export function FuturesDataQuotes(state = {
    isFetching: false,
    FuturesData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchFuturesQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchFuturesQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        FuturesData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchFuturesQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}
// The quotes reducer
export function FuturesAddrsDataQuotes(state = {
    isFetching: false,
    FuturesAddrsData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchFuturesAddrsQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchFuturesAddrsQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        FuturesAddrsData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchFuturesAddrsQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

// The quotes reducer
export function Tips(state = {
    tipText:'',
    tipstate:false
  }, action) {
  switch (action.type) {
    case constants.tips_START:
      return objectAssign({}, state, { 
        tipstate: true,
        tipText: action.response
      })
    case constants.tips_STOP:
      return objectAssign({}, state, {
        tipstate: false,
        tipText:''
      })
    default:
      return state
    }
}

// The quotes reducer
export function operateDatas(state = {
    isFetching: false,
    authenticated: false,
  }, action) {
  switch (action.type) {
    case constants.operateDataQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.operateDataQuote_SUCCESS:
      // return objectAssign({}, state, {
      //   isFetching: false,
      //   operateDataResult: action.response,
      //   tipstate:true,
      //   authenticated: action.authenticated || false
      // })
    case constants.operateDataQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

// The quotes reducer
export function HostFuturesQuotes(state = {
    isFetching: false,
    HostFuturesData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchHostFuturesQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchHostFuturesQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        HostFuturesData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchHostFuturesQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}
// The quotes reducer
export function AccountFollowsQuotes(state = {
    isFetching: false,
    AccountFollowsData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchAccountFollowsQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchAccountFollowsQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        AccountFollowsData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchAccountFollowsQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}



// The quotes reducer
export function FollowFuturesQuotes(state = {
    isFetching: false,
    FollowFuturesData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchFollowFuturesQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchFollowFuturesQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        FollowFuturesData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchFollowFuturesQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

// The quotes reducer
export function AccountsQuotes(state = {
    isFetching: false,
    AccountsData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchAccountsQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchAccountsQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        AccountsData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchAccountsQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

// The quotes reducer
export function ConfigsQuotes(state = {
    isFetching: false,
    ConfigsData: 0,
    authenticated: false
  }, action) {
  switch (action.type) {
    case constants.fetchConfigsDataQuote_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchConfigsDataQuote_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        ConfigsData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchConfigsDataQuote_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

export function GroupsQuotes(state = {
    isFetching: false,
    GroupsData: 0,
  }, action) {
  switch (action.type) {
    case constants.fetchGroups_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchGroups_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        GroupsData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchGroups_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

export function GroupRelationsQuotes(state = {
    isFetching: false,
    GroupRelationsData: 0,
  }, action) {
  switch (action.type) {
    case constants.fetchGroupRelations_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchGroupRelations_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        GroupRelationsData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchGroupRelations_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}

export function ContractFilterQuotes(state = {
    isFetching: false,
    ContractFilterData: 0,
  }, action) {
    // console.log("nothing is happening")
  switch (action.type) {
    case constants.fetchContractFilter_REQUEST:
      return objectAssign({}, state, {
        isFetching: true
      })
    case constants.fetchContractFilter_SUCCESS:
      return objectAssign({}, state, {
        isFetching: false,
        ContractFilterData: action.response,
        authenticated: action.authenticated || false
      })
    case constants.fetchContractFilter_FAILURE:
      return objectAssign({}, state, {
        isFetching: false
      })
    default:
      return state
    }
}
