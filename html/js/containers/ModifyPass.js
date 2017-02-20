import React, { Component, PropTypes } from 'react'
import ModalBox from './components/Modal'
import InputBox from './components/InputBox'
import { operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router'

@connect(
  state => ({
    Tips:state.Tips,
    auth:state.auth
    }),
  {operateDataQuote,openTips}
)

export default class ModifyPass extends Component {

	state = {
		open:false
	}

    componentWillMount =()=>{
        if (!this.props.auth.isAuthenticated) {
                browserHistory.push('/login')
                return
            };
    }

	oldpasswordChange = (e)=>{
		this.setState({
			oldpassword:e.target.value
		})
	}

	newpasswordChange = (e)=>{
		this.setState({
			newpassword:e.target.value
		})
	}

	renewpasswordChange = (e)=>{
		this.setState({
			repassword:e.target.value
		})
	}

	modify = () =>{
		this.setState({
			open: (this.state.open == true) ? false : true,
			head:'修改密码',
			content:(
				<form>
					<InputBox header = '旧密码' indeed={true} handleSelect = {this.oldpasswordChange} />
					<InputBox header = '新密码' indeed={true} handleSelect = {this.newpasswordChange} />
					<InputBox header = '重复新密码' indeed={true} handleSelect = {this.renewpasswordChange} />
				</form>
				)
		})
	}

	submitData = () => {
            if (!this.state.oldpassword) {
                this.props.openTips('未填写旧密码')
                return;
            }
            if (!this.state.newpassword || !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_\.]{6,20}$/.test(this.state.newpassword)) {
                this.props.openTips('新密码格式不正确')
                return;
            }
            if (this.state.repassword!=this.state.newpassword) {
                this.props.openTips('两次密码不相符')
                return;
            }

            let body = "oldpassword="+this.state.oldpassword+"&newpassword="+this.state.newpassword+"&OperId="+localStorage.getItem('userid');

            this.setState({ 
            	open: (this.state.open == true) ? false : true,
            })
            
            this.props.operateDataQuote('admin/ModifyPass',`${body}`)
        }

  render() {
    // console.log(this.props)
    return (
    	<div>
      <button className="btn btn-primary" onClick={this.modify} style={{margin:'8px',float:'right'}}>修改密码</button>
      <ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.submitData }
       />
    	</div>
    )
  }

}

