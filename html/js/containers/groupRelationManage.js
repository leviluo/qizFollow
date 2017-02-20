import React, { Component, PropTypes } from 'react'
import CheckTableBox from './components/CheckTableBox/CheckTableBox'
import ModalBox from './components/Modal/modal'
import InputBox from './components/InputBox'
import SelectBox from './components/SelectBox'
import SelectBoxCondition from './components/SelectBoxCondition'
import { asyncConnect } from 'redux-async-connect';
import { fetchGroupRelations,fetchGroups,fetchAccountsQuote,operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';
import Confirms from './components/Confirms/Confirms'
import fetchData from './fetchData'
import { browserHistory } from 'react-router'

const tableHeader = [
  {key:'name',value:'组名'},
  {key:'HostAccount',value:'主账户'},
  {key:'HostFuturesName',value:'主期货公司'},
  {key:'FollowAccount',value:'从账户'},
  {key:'FollowFuturesName',value:'从期货公司'},
  {key:'status',value:'状态',selectedView:{0:'启用',1:'停用'}},
  {key:'FollowRatio',value:'跟单比率'},
  {key:'FollowDirection',value:'跟单方向',selectedView:{0:'正向',1:'反向'}}
]

@asyncConnect([{
promise: ({store: {dispatch, getState}}) => {
  const promises = [];

  // if (!getState().GroupRelationsQuotes.GroupRelationsData) {
    // promises.push(dispatch(fetchGroupRelations('Groups/GroupRelationsData')));
  // }
  promises.push(dispatch(fetchGroups('Groups/GroupsData')));
  promises.push(dispatch(fetchAccountsQuote('admin/GetAccounts')));

  return Promise.all(promises);
  }
}])

@connect(
  state => ({
    dataQuoteResult:state.dataQuotes.dataQuoteResult,
    Tips:state.Tips,
    auth:state.auth,
    GroupRelationsData:state.GroupRelationsQuotes.GroupRelationsData,
    GroupsData:state.GroupsQuotes.GroupsData,
    AccountsData : state.AccountsQuotes.AccountsData
    }),
  {fetchGroupRelations,operateDataQuote,openTips}
)

export default class groupManage extends Component {

        state = {
          open:false,
          openConfirms:false,
          FollowAccoutCondition:'',
          HostAccoutCondition:''
        }

        componentWillMount =()=>{
          if (!this.props.auth.isAuthenticated) {
                browserHistory.push('/login')
                return
            };

            this.HostAccounts = []
            this.FollowAccounts = []
            if (this.props.AccountsData) {
                for (var i = 0; i < this.props.AccountsData.length; i++) {
                    if(this.props.AccountsData[i].AccountType==0){
                        this.HostAccounts.push(this.props.AccountsData[i])
                    }else{
                        this.FollowAccounts.push(this.props.AccountsData[i])
                    }
                };
            };
            this.GroupsItems = [];
            for (var i = 0; i < this.props.GroupsData.length; i++) {
              var ob = {}
              ob.id = this.props.GroupsData[i].id
              ob.value = this.props.GroupsData[i].name
              this.GroupsItems.push(ob)
            };
        }

        groupName =(e)=>{
          this.setState({
            groupName:e.target.value
          })
        }

        GroupNameChange =(e)=>{
          this.setState({
            addGroupid:e.target.value
          })
        }
        HostAccountChange =(e)=>{
          this.setState({
            HostAccount:e.target.value
          })
        }
        FollowAccountChange =(e)=>{
          this.setState({
            HostAccount:e.target.value
          })
        }

        addRelationsModal =(e,items)=>{
          for (var i = 0; i < items.length; i++) {
            for (var j = 0; j < this.state.resultdata.length; j++) {
              if(this.state.resultdata[j] == this.state.AccountFollows[items[i]]){
                this.props.openTips("关系已添加")
                return
              }
            };
            this.state.resultdata.push(this.state.AccountFollows[items[i]])
          };
          this.setState({})
        }

        deleteRelationsModal =(e,item)=>{
          var items = item.sort()
          var num = this.state.resultdata.length
            for (var i = 0; i < items.length; i++) {
                this.state.resultdata.splice(items[i] - (num-this.state.resultdata.length),1)
            };
          this.setState({})
        }

        filterdata = (type)=>{
            if (type.HostAccoutCondition != undefined) {
                var HostAccoutCondition = type.HostAccoutCondition
                var FollowAccoutCondition = this.state.FollowAccoutCondition
            } else if (type.FollowAccoutCondition != undefined) {
                var FollowAccoutCondition = type.FollowAccoutCondition
                var HostAccoutCondition = this.state.HostAccoutCondition
            };
            var data = this.state.resource.concat();
            var num = data.length
            for (var i = 0; i < num; i++) {
                var index = i-(num-data.length)
                if((HostAccoutCondition != data[index].HostAccount && HostAccoutCondition !== '' ) || (FollowAccoutCondition != data[index].FollowAccount && (FollowAccoutCondition !== '' ) ) ){
                    data.splice(index,1)
                }
            };
            this.state.AccountFollows.splice(0,this.state.AccountFollows.length)
            for (var i = 0; i < data.length; i++) {
              this.state.AccountFollows.push(data[i])
            };
        }

        HostAccountChange = (e) =>{
            var value = e.target.value
            this.filterdata({HostAccoutCondition:value})
            this.setState({
                HostAccoutCondition:value,
            })
        }

        FollowAccountChange = (e) =>{
            var value = e.target.value
            this.filterdata({FollowAccoutCondition:value})
            this.setState({
                FollowAccoutCondition:value,
            })
        }

        submitNewRelations =(e)=>{
          // console.log(this.state.resultdata)
          // this.props.operateDataQuote('Groups/addNewRelations',)
          if (this.state.resultdata.length < 1) {
            this.props.openTips("没有添加新数据")
            return
          };
          var data = this.state.resultdata
            var str = ''
            for (var i = 0; i < data.length; i++) {
                str += data[i].id + ','
            };
            // console.log(str)
            this.props.operateDataQuote('/Groups/addNewRelations',`ids=${str.slice(0,-1)}&groupid=${this.refs.GroupAddRelation.getValue()}`)
            this.setState({
                openConfirms: this.state.openConfirms ? false : true,
            })
        }

        //新增数据
        addModal =()=>{
          if(!this.refs.GroupAddRelation.getValue()){
            this.props.openTips("请选择组名")
            return
          }
          fetchData('Groups/GetAccountFollowsGroupAviable',`groupid=${this.refs.GroupAddRelation.getValue()}`).then((res)=>res.json()).then((result)=>{
            var data = result.id ? [] : result;
            this.setState({
              AccountFollows:data,
              resource:data.concat()
            })
          }).then(()=>{
            var resultdata = []
            this.setState({
              openConfirms:this.state.openConfirms?false:true,
              confirm:this.submitNewRelations,
              confirmHead:'组添加新关系',
              groupName:'',
              resultdata:resultdata,
              ConfirmText: <div style={{marginBottom:'60px',textAlign:'left'}}>
              <b>可添加关系：</b><br/>
              <div className="pull-left" style={{paddingTop:'10px'}}>
              <SelectBoxCondition header = "主账户" items={this.HostAccounts} defaultValue="" handleSelect={this.HostAccountChange} />
              <SelectBoxCondition header = "从账户" items={this.FollowAccounts} defaultValue="" handleSelect={this.FollowAccountChange} />
              </div>
              <CheckTableBox 
                add = {this.addRelationsModal}
                addHeader = "新增"
                data = {this.state.AccountFollows}
                tableHeader = {[{key:'HostAccount',value:"主账户"}, 
                    {key:'FollowAccount',value:"从账户"}]} 
               />
               <br />
               <br />
               <br /><b>新添加关系：</b>
              <CheckTableBox 
                batchdelete = {this.deleteRelationsModal}
                batchdeleteHeader = "批量删除"
                data = {resultdata}
                tableHeader = {[{key:'HostAccount',value:"主账户"}, 
                    {key:'FollowAccount',value:"从账户"}]} 
               />
              </div>
            })
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
                confirmHead:'消息提示',
                openConfirms:this.state.openConfirms ? false : true,
                confirm:this.confirmDeleteRelations,
                ConfirmText:`确认要删除这些关系吗?`,
            })
        }

        confirmDeleteRelations =()=>{
          var ids = ''
          for (var i = 0; i < this.state.deleteitems.length; i++) {
            console.log(this.props.GroupRelationsData[this.state.deleteitems[i]])
            ids += this.props.GroupRelationsData[this.state.deleteitems[i]].id + ','
          };
          // console.log(ids.slice(0,-1))
          this.props.operateDataQuote('Groups/deleteGroupRelations',`ids=${ids.slice(0,-1)}`,this.getRelations)
          this.setState({
            openConfirms:this.state.openConfirms?false:true,
          })
        }

        getRelations=()=>{
          var str = '';
          if(this.refs.GroupNameChange.getValue()){
            str = `GroupName=${this.refs.GroupNameChange.getValue()}&`
          }

          if(this.refs.HostAccountChange.getValue()){
            str += `HostAccount=${this.refs.HostAccountChange.getValue()}&`
          }

          if(this.refs.FollowAccountChange.getValue()){
            str += `FollowAccount=${this.refs.FollowAccountChange.getValue()}&`
          }

          // console.log(str)
          if (str) {
            this.props.fetchGroupRelations('Groups/GroupRelationsData',str.slice(0,-1))
          }else{
            this.props.fetchGroupRelations('Groups/GroupRelationsData')
          }
        }

        render() {
          // let data = [{}]
          return <div>
          <div className="pull-left" style={{width:'280px',margin:'0 5px',paddingTop:'10px'}}>
          <SelectBox header = "组名" items={this.GroupsItems} defaultValue="" ref="GroupNameChange" />
          </div>
          <div className="pull-left" style={{width:'280px',margin:'0 5px',paddingTop:'10px'}}>
          <SelectBox header = "主账户" items={this.HostAccounts} defaultValue="" ref="HostAccountChange" />
          </div>
          <div className="pull-left" style={{width:'280px',margin:'0 5px',paddingTop:'10px'}}>
          <SelectBox header = "从账户" items={this.FollowAccounts} defaultValue="" ref="FollowAccountChange" />
          </div>
          <div className="pull-left" style={{paddingTop:'10px'}}>
          <button className="btn btn-primary" onClick={this.getRelations}>查找</button>
          </div>
          <CheckTableBox 
            batchdelete = {this.deleteModal}
            batchdeleteHeader = "批量删除"
            data = {this.props.GroupRelationsData}
            tableHeader = {tableHeader} 
           />
           <br />
           <br />
           <br />
          <div className="pull-left" style={{width:'280px',margin:'0 5px',paddingTop:'10px'}}>
            <SelectBox header = "组名" items={this.GroupsItems} defaultValue="" ref="GroupAddRelation" />
          </div>
          <div className="pull-left" style={{paddingTop:'10px'}}>
           <button className="btn btn-primary" onClick={this.addModal}>新增关系</button>
          </div>
           < ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.submitData }
            /> 
            <Confirms confirm={this.state.confirm} head={this.state.confirmHead} ConfirmText={this.state.ConfirmText} open = {this.state.openConfirms} />
          </div> 
        }
    }
