import React from 'react'
import { Router, Route,browserHistory, IndexRoute } from 'react-router'
import { ReduxAsyncConnect, asyncConnect, reducer as reduxAsyncConnect } from 'redux-async-connect'

const getIndex = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/Index')
        cb(null, target.default)
    },'index')
}

const getHome = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/Home')
        cb(null, target.default)
    },'home')
}

const getAccountManage = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/accountManage')
        cb(null, target.default)
    },'accountManage')
}

const getTradeManage = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/tradeManage')
        cb(null, target.default)
    },'tradeManage')
}

const getRealtionManage = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/realtionManage')
        cb(null, target.default)
    },'realtionManage')
}

const getConfigManage = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/configManage')
        cb(null, target.default)
    },'configManage')
}


const getLogin = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/Login')
        cb(null, target.default)
    },'login')
}

const getgroupManage = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/groupManage')
        cb(null, target.default)
    },'groupManage')
}

const getgroupRelationManage = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/groupRelationManage')
        cb(null, target.default)
    },'groupRelationManage')
}

const getgroupSetting = (nextState, cb) => {
    require.ensure([], require => {
        var target = require('../containers/groupSetting')
        cb(null, target.default)
    },'groupSetting')
}

const requireAdmin = (nextState, replace, next) => {
    if (localStorage.getItem('id_token')) {
        next()
        return
    }
    replace({ pathname: '/login' })
    next()
}

const Routers = (
	<Router history={browserHistory} render={(props) => <ReduxAsyncConnect {...props}/>}>
    <Route path="/" getComponent={getIndex}>
      <IndexRoute getComponent={getHome}/>
      <Route path="/accountManage" getComponent={getAccountManage} onEnter={requireAdmin}/>
      <Route path="/tradeManage" getComponent={getTradeManage} onEnter={requireAdmin}/>
      <Route path="/realtionManage" getComponent={getRealtionManage} onEnter={requireAdmin}/>
      <Route path="/configManage" getComponent={getConfigManage} onEnter={requireAdmin}/>
      <Route path="/groupManage" getComponent={getgroupManage} onEnter={requireAdmin}/>
      <Route path="/groupRelationManage" getComponent={getgroupRelationManage} onEnter={requireAdmin}/>
      <Route path="/groupSetting" getComponent={getgroupSetting} onEnter={requireAdmin}/>
      <Route path="/login" getComponent={getLogin}/>
    </Route>
  </Router>
	)

export default Routers;