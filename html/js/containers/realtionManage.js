import React, { Component, PropTypes } from 'react'
import TableBox from './components/TableBox'
import CheckTableBox from './components/CheckTableBox/CheckTableBox'
import ModalBox from './components/Modal/modal'
import SelectBox from './components/SelectBox'
import SelectBoxCondition from './components/SelectBoxCondition'
import InputBox from './components/InputBox'
import InputBasic from './components/InputBasic/InputBasic'
import RadioBox from './components/RadioBox'
import CheckBox from './components/CheckBox/checkBox'
import TextareaBox from './components/TextareaBox'
import Confirms from './components/Confirms/Confirms'
import { asyncConnect } from 'redux-async-connect';
import { fetchHostFuturesQuote,fetchContractFilterQuote,fetchAccountFollowsQuote,fetchFollowFuturesQuote,fetchAccountsQuote,operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';
import fetchData from './fetchData'
import { browserHistory } from 'react-router'

const statusitems = [{id:0,value:'启用'},{id:1,value:'停用'}]
const followdirections = [{id:0,value:'正向'},{id:1,value:'反向'}]

@asyncConnect([{
promise: ({store: {dispatch, getState}}) => {
  const promises = [];

promises.push(dispatch(fetchHostFuturesQuote('admin/GetHostFutures')));
promises.push(dispatch(fetchAccountFollowsQuote('AccountFollows/GetAccountFollows')));
promises.push(dispatch(fetchFollowFuturesQuote('admin/GetFollowFutures')));
promises.push(dispatch(fetchAccountsQuote('admin/GetAccounts')));

  return Promise.all(promises);
}
}])

@connect(
  state => ({
    auth:state.auth,
    Tips:state.Tips,
    AccountFollowsData:state.AccountFollowsQuotes.AccountFollowsData,
    HostFuturesData:state.HostFuturesQuotes.HostFuturesData,
    FollowFuturesData: state.FollowFuturesQuotes.FollowFuturesData,
    AccountsData : state.AccountsQuotes.AccountsData,
    contractFilterData: state.ContractFilterQuotes.ContractFilterData
    }),
  {fetchHostFuturesQuote,operateDataQuote,fetchAccountFollowsQuote,fetchFollowFuturesQuote,fetchAccountsQuote,openTips,fetchContractFilterQuote}
)
export default class relationManage extends Component {


        state = {
            TipState:false,
            open:false,
            Remark:'',
            Status:0,
            FollowDirection:0,
            FuturesID:1,
            HostAccounts:[],
            FollowAccounts:[],
            HostFuturesNameCondition:"",
            FollowFuturesNameCondition:"",
            HostAccountCondition:"",
            FollowAccountCondition:"",
            ContractDirection:0,
            modifyContractDirection:0,
          }

        componentWillMount = () => {
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
            var me = this;
            this.tableHeader = [
                    {key:'HostFuturesName',value:"主期货公司"},
                    {key:'HostAccount',value:"主账户"}, 
                    {key:'hostaccountName',value:"主账户别名"}, 
                    {key:'FollowFuturesName',value:"从期货公司"}, 
                    {key:'FollowAccount',value:"从账户"}, 
                    {key:'FollowaccountName',value:"从账户别名"},
                    {key:'Status',value:"状态",selectedView:{0:'启用',1:'关闭'}}, 
                    {key:'FollowRatio',value:"跟单比率"}, 
                    {key:'FollowDirection',value:"跟单方向",selectedView:{0:'正向',1:'反向'}},
                    {key:'OperName',value:"操作人"}, 
                    {key:'updatetime',value:"更新时间"},
                    {key:'FilterNumber',value:"合约过滤",extendsMethod:function(value,index){return <a onClick={()=>me.queryContractFilter(index)}>{value > 0 ? value+'条过滤' : '添加'}</a>}},
                    {key:'ConvertNumber',value:"合约转换",extendsMethod:function(value,index){return <a onClick={()=>me.queryContractConvert(index)}>{value > 0 ? value+'条转换' : '添加'}</a>}},
                    {key:'modify',value:"修改",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.modifyModal(index)}>修改</button>}},
                    // {key:'delete',value:"删除",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.deleteModal(index)}>删除</button>}}
                    ]
           if (this.props.AccountFollowsData) {
                this.setState({
                    AccountFollowsData:this.props.AccountFollowsData
                })
           };
        }

        componentWillReceiveProps =(nextProps) =>{
            this.setState({
                    AccountFollowsData:nextProps.AccountFollowsData,
                    HostFuturesNameCondition:"",
                    FollowFuturesNameCondition:"",
                    HostAccountCondition:"",
                    FollowAccountCondition:"",
                })
        }

        HostFuturesChange = (e) => {
            let HostAccounts = []
            test:
            for (var i = 0; i < this.props.AccountsData.length; i++) {
                if(this.props.AccountsData[i].FuturesName == (e.target.value || FuturesName)  && this.props.AccountsData[i].AccountType == 0){
                    if (this.state.FollowAccountID) {
                        for (var j = 0; j < this.state.AccountFollowsData.length; j++) {
                            if(this.state.AccountFollowsData[j].HostAccountID == this.props.AccountsData[i].id && this.state.AccountFollowsData[j].FollowAccountID == this.state.FollowAccountID){
                                break test
                            }
                        };
                    }
                    HostAccounts.push(this.props.AccountsData[i]);
                }
            };

            this.setState({
                HostAccounts:HostAccounts,
                HostAccountID:'',
            })

            document.getElementById('HostAccounts').options[0].selected=true

            this.changeContent(HostAccounts,this.state.FollowAccounts)
        }

        FollowFuturesChange = (e) => {

            let FollowAccounts = []

            test:
            for (var i = 0; i < this.props.AccountsData.length; i++) {
                if(this.props.AccountsData[i].FuturesName == (e.target.value || FuturesName) && this.props.AccountsData[i].AccountType == 1){
                    if (this.state.HostAccountID) {
                        for (var j = 0; j < this.state.AccountFollowsData.length; j++) {
                            if(this.state.AccountFollowsData[j].HostAccountID == this.state.HostAccountID && this.state.AccountFollowsData[j].FollowAccountID == this.props.AccountsData[i].id){
                                break test
                            }
                        };
                    }
                    FollowAccounts.push(this.props.AccountsData[i]);
                }
            };

            this.setState({
                FollowAccounts:FollowAccounts,
                FollowAccountID:'',
            })

            document.getElementById('FollowAccounts').options[0].selected=true

            this.changeContent(this.state.HostAccounts,FollowAccounts)
            // }else{
            //     this.changeModifyContent(index,this.state.HostAccounts,FollowAccounts)
            // }
        }

        HostAccountsChange = (e) => {
            if (this.state.FollowAccounts.length > 0) {
                var num = this.state.FollowAccounts.length
                if (e.target.value) {
                    test:for (var i = 0; i < this.state.FollowAccounts.length; i++) {
                        for (var j = 0; j < this.state.AccountFollowsData.length; j++) {
                            if(this.state.AccountFollowsData[j].HostAccountID == e.target.value && this.state.AccountFollowsData[j].FollowAccountID == this.state.FollowAccounts[i].id){
                                this.state.FollowAccounts.splice(i-(num-this.state.FollowAccounts),1)
                                break test
                            }
                        };
                    };
                }
            };
            
            this.setState({
                HostAccountID:e.target.value,
            })

        }

        FollowAccountsChange = (e) => {
            this.setState({
                FollowAccountID:e.target.value
            })
        }

        FollowDirectionChange = (e) => {
            this.setState({
                FollowDirection:e.target.value
            })
        }

        StatusChange = (e) => {
            this.setState({
                Status:e.target.value
            })
        }

        FollowRatioChange = (e) => {
            this.setState({
                FollowRatio:e.target.value
            })
        }

        RemarkChange = (e) => {
            this.setState({
                Remark:e.target.value
            })
        }

        groupCheck = (items) =>{
            this.setState({
                groups:items
            })
        }

        changeContent = (HostAccount,FollowAccount) =>{
            fetchData('Groups/GroupsData').then((res)=>res.json()).then((result)=>{
                this.setState({
                    content:(<form>
                                    <SelectBox header = "主期货公司" indeed={true} defaultValue="" items={this.props.HostFuturesData} handleSelect ={this.HostFuturesChange}/>
                                    <SelectBox id="HostAccounts" header = "主账户" indeed={true} defaultValue="" items={HostAccount || this.state.HostAccounts} handleSelect ={this.HostAccountsChange}/>
                                    <SelectBox header = "从期货公司" indeed={true} id="FollowFutures" defaultValue="" items={this.props.FollowFuturesData} handleSelect ={this.FollowFuturesChange}/>
                                    <SelectBox id="FollowAccounts" header = "从账户" id="FollowAccounts" indeed={true} defaultValue="" items={FollowAccount || this.state.FollowAccounts} handleSelect ={this.FollowAccountsChange}/>
                                    <RadioBox header = '跟单方向' name="FollowDirection" indeed={true} defaultValue="0" items={followdirections} handleRadio = {this.FollowDirectionChange}/>
                                    <InputBox header = '跟单比率' indeed={true} handleSelect = {this. FollowRatioChange}/>
                                    <RadioBox header = '状态' name="Status" indeed={true} defaultValue="0" items={statusitems} handleRadio = {this.StatusChange}/>
                                    <CheckBox header = "组" name="groups" handleCheck={this.groupCheck} value="name" items={result}/>
                                    <TextareaBox header = '备注' handleSelect = {this.RemarkChange}/>
                            </form>)
                })

            })
        }

        addModal = () => {
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'主从关系配置--添加新关系',
                FollowAccountID:"",
                FollowDirection:0,
                FollowRatio:"",
                Remark:"",
                FollowaccountName:"",
                HostAccountID:"",
                Status:0,
                hostaccountName:"",
                submitData:this.submitData,
            });
            this.changeContent([],[]);
        }

        modifyModal = (index) => {
            // let index = e.target.name || e.target.getAttribute("name");
            // console.log(this.props.AccountFollowsData[index])
            let HostAccounts = [];
            let FollowAccounts = [];

            for (var i = 0; i < this.props.AccountsData.length; i++) {
                if(this.props.AccountsData[i].FuturesName == this.state.AccountFollowsData[index].HostFuturesName && this.props.AccountsData[i].AccountType == 0){
                    HostAccounts.push(this.props.AccountsData[i]);
                    continue;
                }
                if(this.props.AccountsData[i].FuturesName == this.state.AccountFollowsData[index].FollowFuturesName && this.props.AccountsData[i].AccountType == 1){
                    FollowAccounts.push(this.props.AccountsData[i]);
                    continue;
                }
            };

            this.setState({
                HostAccounts:HostAccounts,
                FollowAccounts:FollowAccounts,
                open: (this.state.open == true) ? false : true,
                head:'主从关系配置--修改',
                submitData:this.submitData,
                FollowAccountID:this.state.AccountFollowsData[index].FollowAccountID,
                FollowDirection:this.state.AccountFollowsData[index].FollowDirection,
                FollowRatio:this.state.AccountFollowsData[index].FollowRatio,
                Remark:this.state.AccountFollowsData[index].Remark,
                FollowaccountName:this.state.AccountFollowsData[index].FollowaccountName,
                HostAccountID:this.state.AccountFollowsData[index].HostAccountID,
                Status:this.state.AccountFollowsData[index].Status,
                hostaccountName:this.state.AccountFollowsData[index].hostaccountName,
                AccountFollowID:this.state.AccountFollowsData[index].id,
                content:(<form>
                                <SelectBox header = "主期货公司" indeed={true} defaultValue={this.state.AccountFollowsData[index].HostFuturesName} items={this.props.HostFuturesData} handleSelect ={this.HostFuturesChange}/>
                                <SelectBox id="HostAccounts" header = "主账户" indeed={true} defaultValue={this.state.AccountFollowsData[index].HostAccountID} items={HostAccounts} handleSelect ={this.HostAccountsChange}/>
                                <SelectBox header = "从期货公司" indeed={true} defaultValue={this.state.AccountFollowsData[index].FollowFuturesName} items={this.props.FollowFuturesData} handleSelect ={this.FollowFuturesChange}/>
                                <SelectBox id="FollowAccounts" header = "从账户" indeed={true} defaultValue={this.state.AccountFollowsData[index].FollowAccountID} items={FollowAccounts} handleSelect ={this.FollowAccountsChange}/>
                                <RadioBox header = '跟单方向' name="FollowDirection" indeed={true} defaultValue={this.state.AccountFollowsData[index].FollowDirection} items={followdirections} handleRadio = {this.FollowDirectionChange}/>
                                <InputBox header = '跟单比率' indeed={true} defaultValue={this.state.AccountFollowsData[index].FollowRatio} handleSelect = {this. FollowRatioChange}/>
                                <RadioBox header = '状态' name="Status" indeed={true} defaultValue={this.state.AccountFollowsData[index].Status} items={statusitems} handleRadio = {this.StatusChange}/>
                                <TextareaBox header = '备注' defaultValue={this.state.AccountFollowsData[index].Remark} handleSelect = {this.RemarkChange}/>
                        </form>)
            });
        }

        deleteModal = (e,items) => {
            if (items.length < 1) {
                this.props.openTips("请选择数据")
                return
              };
            this.setState({
                deleteurl:'AccountFollows/delAccountFollowData',
                // deleteObject:this.state.AccountFollowsData,
                // deleteid:this.state.AccountFollowsData[index].id,
                // deleteindex:index,
                deleteitems:items,
                confirm:this.confirm,
                openConfirms:this.state.openConfirms ? false : true,
                ConfirmText:`此操作不可恢复,确认要删除吗?`,
            })
        }

        ContractNameChange =(e)=>{
            this.setState({
                ContractName:e.target.value
            })
        }

        addContractFilter =(e) =>{
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
            console.log(item)
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
            return true
        }

        confirmContractFilter = (e) =>{
            var str = '';
            for (var i = 0; i < this.state.contractFilterData.length; i++) {
                str += this.state.contractFilterData[i].contractid + ','
            };
            this.props.operateDataQuote('/AccountFollows/modifyContractFilter',`items=${str.slice(0,-1)}&followid=${this.state.followid}`,this.updateView)
            this.setState({
                openConfirms: this.state.openConfirms ? false : true,
            })
        }

        queryContractFilter =(index)=>{
            fetchData('AccountFollows/getContractFilter',`followid=${this.state.AccountFollowsData[index].id}`).then((res)=>res.json()).then((result)=>{
                var data = result.id ? [] : result;
                this.setState({
                    followid:this.state.AccountFollowsData[index].id,
                    confirm:this.submitContractFilter,
                    ConfirmText: <div>
                       <InputBasic header = "合约名称" handleSelect = {this.ContractNameChange}/>
                    <button className="btn btn-primary" onClick = {this.addContractFilter}>添加合约过滤</button>
                    <CheckTableBox
                        keyy = {Math.random()} 
                        batchdelete = {this.deleteContractModal}
                        batchdeleteHeader = "批量删除"
                        tableHeader = {[{key:'contractid',value:'合约'}]} 
                        data={data} />
                    <div style={{textAlign:'left'}}>
                    </div>
                    </div>,
                    contractFilterData:data,
                    openConfirms:this.state.openConfirms ? false : true,
                    confirm:this.confirmContractFilter
                })
            })
        }

        deleteContractConvertModal =(e,item)=>{
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


        submitContractConvert =() =>{
            // console.log(this.state.contractConvertData)
            var data = this.state.contractConvertData
            var str = ''
            for (var i = 0; i < data.length; i++) {
                str += JSON.stringify(data[i]) + ','
            };

            this.props.operateDataQuote('/AccountFollows/modifyContractConvert',`items=[${str.slice(0,-1)}]&followid=${this.state.followid}`,this.updateView)
            this.setState({
                openConfirms: this.state.openConfirms ? false : true,
            })
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
                this.props.openTips('比率大于0')
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

        
        modifyContractDirection = (e) =>{
            this.setState({
                modifyContractDirection:e.target.value
            })
        }

        modifyContractratio = (e) =>{
            this.setState({
                modifyContractratio:e.target.value
            })
        }

        modifyContractConvert =(e,items)=>{ //修改合约转换
            if (items.length < 1) {
                this.props.openTips('请先选择要修改的数据')
                return
            };
            this.setState({
                open: this.state.open ? false : true,
                head:'转换合约--修改',
                content: <div>
                            <RadioBox header = '方向' name="modifyContractDirection" defaultValue="0" indeed={true} items={followdirections} handleRadio = {this.modifyContractDirection}/>
                            <InputBox header = '倍率' indeed={true}  handleSelect = {this.modifyContractratio}/>  
                        </div>,
                submitData:summitModifyConvert
            })
            var _this = this;
            function summitModifyConvert(){
                if (!(_this.state.modifyContractratio > 0)) {
                _this.props.openTips('比率大于0')
                return;
                }

                if (isNaN(_this.state.modifyContractratio)) {
                    _this.props.openTips('倍率为数字格式')
                    return;
                };
                for (var i = 0; i < _this.state.contractConvertData.length; i++) {
                    for (var j = 0; j < items.length; j++) {
                        if(items[j] == i){
                            _this.state.contractConvertData[i].FollowDirection = _this.state.modifyContractDirection
                            _this.state.contractConvertData[i].ratio = _this.state.modifyContractratio
                        }
                    };
                };
                _this.setState({
                    open: _this.state.open ? false : true,
                });
            }
        }

        queryContractConvert =(index)=>{ //合约转换窗口
            // alert(index)
            fetchData('AccountFollows/getContractConvert',`followid=${this.state.AccountFollowsData[index].id}`).then((res)=>res.json()).then((result)=>{
                var data = result.id ? [] : result;
                this.setState({
                    followid:this.state.AccountFollowsData[index].id,
                    confirm:this.submitContractConvert,
                    ConfirmText: <div style={{textAlign:'left',marginBottom:"10px"}}>
                        <CheckTableBox 
                            keyy = {Math.random()} 
                            batchdelete = {this.deleteContractConvertModal}
                            batchdeleteHeader = "批量删除"
                            batchModify = {this.modifyContractConvert}
                            batchModifyHeader = "批量修改"
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
                    contractConvertData:data,
                    openConfirms:this.state.openConfirms ? false : true,
                    ContractHost:'',
                    ContractConvert:'',
                    ContractDirection:0,
                    Contractratio:'',
                })
            })
        }

        confirm = (e) =>{
            this.setState({ 
                openConfirms: this.state.openConfirms ? false : true,
            })
            var ids = ''
            for (var i = 0; i < this.state.deleteitems.length; i++) {
                ids += this.state.AccountFollowsData[this.state.deleteitems[i]].id + ','
            };
            this.props.operateDataQuote(this.state.deleteurl,'ids='+ids.slice(0,-1),this.updateView)
        }

        submitData = () => {

            if (!this.state.HostAccountID) {
                this.props.openTips('未选择主账户')
                return;
            }

            if (!this.state.FollowAccountID) {
                this.props.openTips('未选择从账户')
                return;
            }

            if (!(this.state.FollowRatio > 0)) {
                this.props.openTips('跟单比率大于0')
                return;
            }

            if (isNaN(this.state.FollowRatio)) {
                this.props.openTips('跟单比率为数字格式')
                return;
            };

            if (this.state.groups && this.state.groups.length > 0) {
                var groups = this.state.groups.join(",")
            }else{
                var groups = ''
            }

            let OperId = localStorage.getItem('userid') ;

            let body = "OperId="+OperId+"&HostAccountID="+this.state.HostAccountID+"&groups="+groups+"&Status="+this.state.Status+"&FollowAccountID="+this.state.FollowAccountID+"&FollowDirection="+this.state.FollowDirection+"&FollowRatio="+this.state.FollowRatio+"&Remark="+this.state.Remark;
            
            if(this.state.head == '主从关系配置--添加新关系'){
                var addon = "&operateType=ADD"
            }else{
                var addon = "&id="+this.state.AccountFollowID+"&operateType=MODIFY"
            }

            this.setState({ 
                open: (this.state.open == true) ? false : true,
            })

            this.props.operateDataQuote('AccountFollows/AccountFollowsData',`${body}${addon}`,this.updateView)
        }

        filterdata = (type)=>{
            if (type.HostFuturesNameCondition != undefined) {
                var HostFuturesNameCondition = type.HostFuturesNameCondition
                var FollowFuturesNameCondition = this.state.FollowFuturesNameCondition
                var HostAccountCondition = this.state.HostAccountCondition
                var FollowAccountCondition = this.state.FollowAccountCondition
            } else if (type.FollowFuturesNameCondition != undefined) {
                var FollowFuturesNameCondition = type.FollowFuturesNameCondition
                var HostFuturesNameCondition = this.state.HostFuturesNameCondition
                var HostAccountCondition = this.state.HostAccountCondition
                var FollowAccountCondition = this.state.FollowAccountCondition
            } else if (type.HostAccountCondition != undefined) {
                var FollowFuturesNameCondition = this.state.FollowFuturesNameCondition
                var HostFuturesNameCondition = this.state.HostFuturesNameCondition
                var HostAccountCondition = type.HostAccountCondition
                var FollowAccountCondition = this.state.FollowAccountCondition
            } else{
                var FollowFuturesNameCondition = this.state.FollowFuturesNameCondition
                var HostFuturesNameCondition = this.state.HostFuturesNameCondition
                var HostAccountCondition = this.state.HostAccountCondition
                var FollowAccountCondition = type.FollowAccountCondition
            }

            var data = this.props.AccountFollowsData.concat();
            var num = data.length
            for (var i = 0; i < num; i++) {
                var index = i-(num-data.length)
                if((HostFuturesNameCondition != data[index].HostFuturesName && HostFuturesNameCondition !== '' ) 
                || (FollowFuturesNameCondition != data[index].FollowFuturesName && FollowFuturesNameCondition !== '') 
                || (HostAccountCondition != data[index].HostAccount && HostAccountCondition !== '') 
                || (FollowAccountCondition != data[index].FollowAccount && FollowAccountCondition !== '') 
                ){
                    data.splice(index,1)
                }
            };
            return data
        }

        HostFuturesNameChange = (e) =>{
            this.setState({
                HostFuturesNameCondition:e.target.value,
                AccountFollowsData:this.filterdata({HostFuturesNameCondition:e.target.value})
            })
        }

        FollowFuturesNameChange = (e) =>{
            this.setState({
                FollowFuturesNameCondition:e.target.value,
                AccountFollowsData:this.filterdata({FollowFuturesNameCondition:e.target.value})
            })
        }

        HostAccountChange = (e) =>{
            this.setState({
                HostAccountCondition:e.target.value,
                AccountFollowsData:this.filterdata({HostAccountCondition:e.target.value})
            })
        }

        FollowAccountChange = (e) =>{
            this.setState({
                FollowAccountCondition:e.target.value,
                AccountFollowsData:this.filterdata({FollowAccountCondition:e.target.value})
            })
        }

        static propTypes = {
          // dispatch: PropTypes.func.isRequired,  
          // isAuthenticated: PropTypes.bool.isRequired,
          // errorMessage: PropTypes.string,
        }

        updateView = () =>{
            this.props.fetchAccountFollowsQuote('AccountFollows/GetAccountFollows')
        }

        render() {
            return <div>
            <SelectBoxCondition header = "主期货公司" items={this.props.HostFuturesData} defaultValue="" handleSelect ={this.HostFuturesNameChange}/>
            <SelectBoxCondition header = "从期货公司" items={this.props.FollowFuturesData} defaultValue="" handleSelect ={this.FollowFuturesNameChange}/>
            <SelectBoxCondition header = "主账户" items={this.HostAccounts} defaultValue="" handleSelect ={this.HostAccountChange}/>
            <SelectBoxCondition header = "从账户" items={this.FollowAccounts} defaultValue="" handleSelect ={this.FollowAccountChange}/>
            < CheckTableBox tableHeader = { this.tableHeader }
            data = { this.state.AccountFollowsData }
            add = {this.addModal}
            addHeader = "新增"
            batchdelete = {this.deleteModal}
            batchdeleteHeader = "批量删除"
            /> < ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.state.submitData }
            /><Confirms confirm={this.state.confirm} head={this.state.confirmHead} ConfirmText={this.state.ConfirmText} open = {this.state.openConfirms} /> 
            </div> 
        }
    }



