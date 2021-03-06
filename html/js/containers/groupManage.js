import React, { Component, PropTypes } from 'react'
import CheckTableBox from './components/CheckTableBox/CheckTableBox'
import ModalBox from './components/Modal/modal'
import InputBox from './components/InputBox'
import { asyncConnect } from 'redux-async-connect';
import { fetchGroups,operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';
import Confirms from './components/Confirms/Confirms'
import { browserHistory } from 'react-router'

@asyncConnect([{
promise: ({store: {dispatch, getState}}) => {
  const promises = [];

  if (!getState().GroupsQuotes.GroupsData) {
    promises.push(dispatch(fetchGroups('Groups/GroupsData')));
  }

  return Promise.all(promises);
  }
}])

@connect(
  state => ({
    dataQuoteResult:state.dataQuotes.dataQuoteResult,
    Tips:state.Tips,
    GroupsData:state.GroupsQuotes.GroupsData,
    auth:state.auth
    }),
  {fetchGroups,operateDataQuote,openTips}
)

export default class groupManage extends Component {

        state = {
          open:false,
          openConfirms:false,
        }

        componentWillMount =()=>{
          if (!this.props.auth.isAuthenticated) {
                browserHistory.push('/login')
                return
            };

          var me = this;
          this.tableHeader = [
              {key:'name',value:'名称'},
              {key:'modify',value:"修改",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.modifyModal(index)}>修改</button>}}
              ]
        }

        groupName =(e)=>{
          this.setState({
            groupName:e.target.value
          })
        }

        //新增数据
        addModal =()=>{
          this.setState({
            open:this.state.open?false:true,
            head:'添加新组',
            groupName:'',
            content: <InputBox header = '组名' indeed={true} handleSelect = {this.groupName}/>
          })
        }
        //删除数据
        deleteModal =(e,items)=>{
          if (items.length < 1) {
            this.props.openTips("请选择数据")
            return
          };
          this.setState({
                deleteitems:items,
                openConfirms:this.state.openConfirms ? false : true,
                ConfirmText:`确认要删除这些组吗?`,
          })
        }
        //修改数据
        modifyModal =(index)=>{
          this.setState({
            open:this.state.open?false:true,
            head:'修改组名',
            modifyid:this.props.GroupsData[index].id,
            groupName:this.props.GroupsData[index].name,
            content: <InputBox header = '组名' defaultValue={this.props.GroupsData[index].name} indeed={true} handleSelect = {this.groupName}/>
          })
        }
        //提交数据
        submitData =()=>{
          if (!this.state.groupName || this.state.groupName.match(/['\s"!@#$%^&*]/)) {
            this.props.openTips('请填写组名或者不能包含特殊字符')
            return
          };
          if (this.state.head == '添加新组') {
          this.props.operateDataQuote('Groups/addGroups',`name=${this.state.groupName}`,this.updateView)
          }else{
          this.props.operateDataQuote('Groups/modifyGroups',`name=${this.state.groupName}&id=${this.state.modifyid}`,this.updateView)
          }
          this.setState({
            open:this.state.open?false:true,
            // openConfirms:false
          })
        }

        updateView =()=>{
          this.props.fetchGroups('Groups/GroupsData')
        }

        confirm =()=>{
          var ids = ''

          for (var i = 0; i < this.state.deleteitems.length; i++) {
            console.log(this.props.GroupsData[this.state.deleteitems[i]])
            ids += this.props.GroupsData[this.state.deleteitems[i]].id + ','
          };

          this.props.operateDataQuote('Groups/deleteGroups',`id=${ids.slice(0,-1)}`,this.updateView)
          this.setState({
            // open:false,
            openConfirms:this.state.openConfirms ? false :true
          })
        }

        render() {
          return <div>
          <CheckTableBox 
            add = {this.addModal}
            addHeader = "新增"
            batchdelete = {this.deleteModal}
            batchdeleteHeader = "批量删除"
            data = {this.props.GroupsData}
            tableHeader = {this.tableHeader} 
           />
           < ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.submitData }
            /> 
            <Confirms confirm={this.confirm} head={this.state.confirmHead} ConfirmText={this.state.ConfirmText} open = {this.state.openConfirms} />
          </div> 
        }
    }
