import React, { Component, PropTypes } from 'react'
import ModifyPass from './ModifyPass'
import Tip from './components/Tip'
import { logoutUser } from '../actions/auth'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {browserHistory} from 'react-router'

@connect(
  state => ({
    errorMessage:state.auth.errorMessage,
    isAuthenticated: state.auth.isAuthenticated,
    Tips:state.Tips,
    auth:state.auth,
    }),
  {logoutUser}
)

export default class Index extends Component {

  static propTypes = {

  }

  componentDidMount=(e)=>{
    if (!this.props.auth.isAuthenticated) {
                browserHistory.push('/login')
                return
            };
    if (document.getElementsByClassName('dropMenu')[0]) { 
      if(this.props.location.pathname == '/groupManage' || this.props.location.pathname == '/groupRelationManage' || this.props.location.pathname == '/groupSetting' ){
        document.getElementsByClassName('dropMenu')[0].setAttribute('class','dropMenu myactive')
      }else{
        document.getElementsByClassName('dropMenu')[0].setAttribute('class','dropMenu')
      }
    };
  }

  render() {
    // let isAuthenticated = localStorage.getItem('id_token') ? true : false
    const {errorMessage,isAuthenticated} = this.props.auth
    if (document.getElementsByClassName('dropMenu')[0]) { 
      if(this.props.location.pathname == '/groupManage' || this.props.location.pathname == '/groupRelationManage' || this.props.location.pathname == '/groupSetting' ){
        document.getElementsByClassName('dropMenu')[0].setAttribute('class','dropMenu myactive')
      }else{
        document.getElementsByClassName('dropMenu')[0].setAttribute('class','dropMenu')
      }
    };
    return (
      <div>
      <nav className='navbar navbar-default'>
        <div className='container-fluid'>
          <div className="navbar-header">
                  <a className="navbar-brand"><img src="img/logo.png" alt="logo" className="img-responsive" style={{marginTop:"-8px"}}/></a>
                      <a className="navbar-brand">奇正辅助交易系统</a>
              </div>
          <div>
            {!isAuthenticated &&
            <div className='navbar-form'>
              <Link to='/login' className="btn btn-primary pull-right">登录</Link>
            </div>
            }
            {isAuthenticated && <div>
              <ul className="nav navbar-nav">
                  <li>
                      <Link to="/tradeManage" activeClassName="myactive">交易系统管理</Link>
                  </li>
                  <li>
                      <Link to="/accountManage" activeClassName="myactive">账户信息管理</Link>
                  </li>
                  <li>
                      <Link to="/realtionManage" activeClassName="myactive">主从关系配置</Link>
                  </li>
                  <li>
                      <Link to="/configManage" activeClassName="myactive">系统管理配置</Link>
                  </li>
                  <li>
                      <a className="dropMenu">组<span className="caret"></span>
                        <ul>
                          <li><Link to='/groupManage'>组管理</Link></li>
                          <li><Link to='/groupRelationManage'>组关系管理</Link></li>
                          <li><Link to='/groupSetting'>组设置</Link></li>
                        </ul> 
                      </a>
                  </li>
              </ul>
              <button className="btn btn-primary pull-right" style={{marginTop:'8px'}} onClick={this.props.logoutUser}>退出</button>
              <ModifyPass tipShow={(text) =>this.showTips(text)} />
              </div>
            }
          </div>
        </div>
      </nav>
       <Tip />
       <div style={{margin:'0 15px'}}>
      {this.props.children}
       </div>
      </div>
    )
  }
}
