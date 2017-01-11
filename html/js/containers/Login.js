import React, { Component, PropTypes } from 'react'
// import { Button  } from 'react-bootstrap';
import { loginUser } from '../actions/auth'
import { openTips } from '../actions/fetchSecretQuote'
import { connect } from 'react-redux'

@connect(
    state => ({
        Tips: state.Tips,
    }), { loginUser, openTips }
)
export default class Login extends Component {

  handleClick = ()=>{
    const operid = this.refs.operid
    const password = this.refs.password
    const creds = { operid: operid.value.trim(), password: password.value.trim() }
    if (!creds.operid) {
          this.props.openTips('未填写用户')
          return;
    }
    if (!creds.password) {
              this.props.openTips('未填写密码')
              return;
    }
    this.props.loginUser(creds)
  }

  render() {
    return (
      <div style={{background:"white"}}>
            <div style={{width:"300px",textAlign:"center",margin:"10px auto",padding:"30px 0"}}>
      <h3 style={{textAlign:"center"}}>登录</h3>
            <div className="input-group" style={{marginRight:"10px"}}>
                <span className="input-group-addon">账户:</span>
                <input name="operid" type="text" className="form-control" ref='operid' placeholder="不能包含特殊字符" />
            </div>
              <br />
            <div className="input-group" style={{marginRight:"10px"}}>
                <span className="input-group-addon">密码:</span>
                <input name="password" type="password" className="form-control" ref='password' placeholder="六位数字密码" />
            </div>
            <br />
        <button onClick={this.handleClick} className="btn btn-primary" style={{width:"100%"}}>
          登录
        </button>
      </div>
      </div>
    )
  } 
}

