import React, { Component, PropTypes } from 'react'
import TableBox from './components/TableBox'
import CheckTableBox from './components/CheckTableBox/CheckTableBox'
import ModalBox from './components/Modal/modal'
import InputBox from './components/InputBox'
import InputBasic  from './components/InputBasic/InputBasic'
import RadioBox from './components/RadioBox'
import Tip from './components/Tip'
import { asyncConnect } from 'redux-async-connect';
import { fetchGroups,operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';
import Confirms from './components/Confirms/Confirms'

const statusitems = [{id:0,value:'启用'},{id:1,value:'停用'}]
const followdirections = [{id:0,value:'正向'},{id:1,value:'反向'}]

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
    }),
  {fetchGroups,operateDataQuote,openTips}
)

export default class groupSetting extends Component {

        state = {
          open:false,
          openConfirms:false,
          ContractDirection:0,
        }

        componentWillMount =()=>{
          var me = this;
          this.tableHeader = [
              {key:'name',value:'名称'},
              ]
        }

        ContractFilter =(e)=>{
          this.setState({
            ContractFilter:e.target.value
          })
        }

        ContractNameChange =(e)=>{
            this.setState({
                ContractName:e.target.value
            })
        }

        addContractFilter =(e) =>{
            // ？？？？
            if(!this.state.ContractName){
                this.props.openTips('合约不为空')
                return
            }
            for (var i = 0; i < this.state.contractFilterData.length; i++) {
                if(this.state.contractFilterData[i].contractid == this.state.ContractName){
                    this.props.openTips('合约不能重复')
                    return
                }
            };
            this.state.contractFilterData.push({contractid:this.state.ContractName})
            this.setState({})
        }

        deleteContractModal =(e,item) =>{
            if (item.length<1) {
                this.props.openTips('没有选择数据')
                return
            };
            var items = item.sort()
            var num = this.state.contractFilterData.length
            for (var i = 0; i < items.length; i++) {
                this.state.contractFilterData.splice(items[i] - (num-this.state.contractFilterData.length),1)
            };
            this.setState({})
        }



        queryContractFilter =()=>{
              if (!this.state.item && this.state.item != 0) {
                  this.props.openTips("请先选择数据")
                  return
                };
                var data = []
                this.setState({
                    confirm:this.submitContractFilter,
                    ConfirmText: <div>
                    <InputBasic header = "合约名称" handleSelect = {this.ContractNameChange}/>
                    <button className="btn btn-primary" onClick = {this.addContractFilter}>添加合约过滤</button>
                    <CheckTableBox 
                        batchdelete = {this.deleteContractModal}
                        batchdeleteHeader = "批量删除"
                        tableHeader = {[{key:'contractid',value:'合约'}]} 
                        data={data} />
                        <br/>
                        <br/>
                        <br/>
                    <div style={{color:"red"}}>提示：当合约为空提交时，会删除所有原有合约过滤，请谨慎确认提交</div>
                    </div>,
                    contractFilterData:data,
                    openConfirms:this.state.openConfirms ? false : true,
                    confirm:this.confirmContractFilter
                })
        }


         deleteContractConvertModal =(e,item)=>{
          // console.log(this.state.contractConvertData)
             if (item.length<1) {
                this.props.openTips('没有选择数据')
                return
            };
            var items = item.sort()
            var num = this.state.contractConvertData.length
            for (var i = 0; i < items.length; i++) {
                this.state.contractConvertData.splice(items[i] - (num-this.state.contractConvertData.length),1)
            };
            this.setState({})
        }

        ContractHost = (e) =>{
            this.setState({
                ContractHost:e.target.value
            })
        }

        ContractConvert = (e) =>{
            this.setState({
                ContractConvert:e.target.value
            })
        }

        ContractDirection = (e) =>{
            this.setState({
                ContractDirection:e.target.value
            })
        }

        Contractratio = (e) =>{
            this.setState({
                Contractratio:e.target.value
            })
        }

        addContractConvert =(e)=>{
            if (!this.state.ContractHost) {
                this.props.openTips('没有填写原合约')
                return
            };
            if (!this.state.ContractConvert) {
                this.props.openTips('没有填写转换合约')
                return
            };
            // console.log(this.state.Contractratio)
            if (!(this.state.Contractratio > 0)) {
                this.props.openTips('没有填写比率')
                return;
            }

            if (isNaN(this.state.Contractratio)) {
                this.props.openTips('倍率为数字格式')
                return;
            };

            for (var i = 0; i < this.state.contractConvertData.length; i++) {
                if(this.state.contractConvertData[i].contractHost == this.state.ContractHost && this.state.contractConvertData[i].contractFollow == this.state.ContractConvert){
                    this.props.openTips('合约转换不能重复')
                    return
                }
            };

            this.state.contractConvertData.push({contractHost:this.state.ContractHost,contractFollow:this.state.ContractConvert,FollowDirection:this.state.ContractDirection,ratio:this.state.Contractratio})
            this.setState({})
        }

         queryContractConvert =()=>{ //合约转换窗口
                if (!this.state.item && this.state.item != 0) {
                  this.props.openTips("请先选择数据")
                  return
                };
                var data = []
                this.setState({
                    openConfirms:this.state.open ? false :true,
                    confirmHead:"修改组设置",
                    ConfirmText: <div style={{textAlign:'left'}}>
                        <CheckTableBox 
                            batchdelete = {this.deleteContractConvertModal}
                            batchdeleteHeader = "批量删除"
                            tableHeader = {[{key:'contractHost',value:'原合约'},{key:'contractFollow',value:'转换合约'},{key:'FollowDirection',value:'方向',selectedView:{0:'正向',1:'反向'}},{key:'ratio',value:'比率'}]} 
                            data={data} />
                            <br/>
                            <br/>
                          <InputBox header = '原合约' indeed={true} handleSelect = {this.ContractHost}/>  
                          <InputBox header = '转换合约' indeed={true}  handleSelect = {this.ContractConvert}/>  
                          <RadioBox header = '方向' name="ContractDirection" defaultValue="0" indeed={true} items={followdirections} handleRadio = {this.ContractDirection}/>
                          <InputBox header = '倍率' indeed={true}  handleSelect = {this.Contractratio}/>  
                          <button className="btn btn-primary pull-right" style={{marginBottom:"20px"}} onClick={this.addContractConvert}>添加</button>
                    </div>,
                    confirm:this.confirmContractConvert,
                    contractConvertData:data
                })
        }


        //提交数据
        submitData =()=>{
            this.setState({
              open:this.state.open ? false : true
            })
        }

        chooseOne =(e,index)=>{
          this.setState({
            item:index
          })
        }

        status =(e)=>{
          this.setState({
            status:e.target.value
          })
        }

        followdirections =(e)=>{
          this.setState({
            followdirections:e.target.value
          })
        }

        ratio =(e)=>{
          this.setState({
            ratio:e.target.value
          })
        }

        confirmContractConvert =(e)=>{
            // alert("")
            // if (this.state.contractConvertData.length < 1) {
            //   this.props.openTips("没有添加合约转换")
            //     return
            // };
            var data = this.state.contractConvertData
            var str = ''
            for (var i = 0; i < data.length; i++) {
                str += JSON.stringify(data[i]) + ','
            };
            this.props.operateDataQuote('Groups/setContractConvert',`items=[${str.slice(0,-1)}]&groupid=${this.props.GroupsData[this.state.item].id}`)
            this.setState({
                openConfirms: this.state.openConfirms ? false : true,
            })
        }

        confirmContractFilter = (e) =>{
          // if (this.state.contractFilterData.length < 1) {
          //   this.props.openTips("没有添加合约")
          //     return
          // };
            var str = '';
            for (var i = 0; i < this.state.contractFilterData.length; i++) {
                str += this.state.contractFilterData[i].contractid + ','
            };
            this.props.operateDataQuote('Groups/setContractFilter',`items=${str.slice(0,-1)}&groupid=${this.props.GroupsData[this.state.item].id}`)
            this.setState({
                openConfirms: this.state.openConfirms ? false : true,
            })
        }

        confirmRatio =()=>{
          if (!this.state.ratio) {
              this.props.openTips("没有设置倍率")
              return
          };
          if (isNaN(this.state.ratio)) {
              this.props.openTips("倍率为正整数")
              return
          };
          this.props.operateDataQuote("Groups/setRatio",`ratio=${this.state.ratio}&groupid=${this.props.GroupsData[this.state.item].id}`)
          this.setState({
            openConfirms:this.state.openConfirms ? false : true,
          })
        }

        confirmDirection =()=>{
          this.props.operateDataQuote("Groups/setfollowdirections",`followdirections=${this.state.followdirections}&groupid=${this.props.GroupsData[this.state.item].id}`)
          this.setState({
            openConfirms:this.state.openConfirms ? false : true,
          })
        }

        confirmStatus =()=>{
          this.props.operateDataQuote("Groups/setStatus",`status=${this.state.status}&groupid=${this.props.GroupsData[this.state.item].id}`)
          this.setState({
            openConfirms:this.state.openConfirms ? false : true,
          })
        }

        commitRatio =(e)=>{
          if (!this.state.item && this.state.item != 0) {
                  this.props.openTips("请先选择数据")
                  return
                };
            this.setState({
                confirmHead:"修改组设置",
                openConfirms:this.state.openConfirms ? false : true,
                ratio:'',
                confirm:this.confirmRatio,
                ConfirmText:<InputBox header = '倍率' indeed={true}  placeHolder="正整数" handleSelect = {this.ratio}/>  
            })
        }

        commitDirection =(e)=>{
          if (!this.state.item && this.state.item != 0) {
                  this.props.openTips("请先选择数据")
                  return
                };
            this.setState({
                confirmHead:"修改组设置",
                openConfirms:this.state.openConfirms ? false : true,
                followdirections:0,
                confirm:this.confirmDirection,
                ConfirmText: 
                 <RadioBox header = '方向' name="followdirections" defaultValue="0" indeed={true} items={followdirections} handleRadio = {this.followdirections}/>
            })
        }

        commitStatus =(e)=>{
          if (!this.state.item && this.state.item != 0) {
                  this.props.openTips("请先选择数据")
                  return
                };
            this.setState({
                confirmHead:"修改组设置",
                openConfirms:this.state.openConfirms ? false : true,
                status:0,
                confirm:this.confirmStatus,
                ConfirmText: 
                 <RadioBox header = '是否启用' name="status" defaultValue="0" indeed={true} items={statusitems} handleRadio = {this.status}/> 
            })
        }

        render() {
          return <div>{ this.props.Tips.tipstate && <Tip text={this.props.Tips.tipText} /> }
          <div className="pull-right" style={{margin:'5px'}}>
          <button className="btn btn-primary" onClick={this.commitStatus}>是否启用</button>&nbsp;
          <button className="btn btn-primary" onClick={this.commitDirection}>方向</button>&nbsp;
          <button className="btn btn-primary" onClick={this.commitRatio}>倍率</button>&nbsp;
          <button className="btn btn-primary" onClick={this.queryContractFilter}>过滤</button>&nbsp;
          <button className="btn btn-primary" onClick={this.queryContractConvert}>合约转换</button>
          </div>
          <TableBox 
            data = {this.props.GroupsData}
            tableHeader = {this.tableHeader} 
            chooseOne = {this.chooseOne}
           />
           < ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.submitData }
            /> 
            <Confirms confirm={this.state.confirm} head={this.state.confirmHead} ConfirmText={this.state.ConfirmText} open = {this.state.openConfirms} />
          </div> 
        }
    }
