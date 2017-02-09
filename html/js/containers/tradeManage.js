import React, { Component, PropTypes } from 'react'
import TableBox from './components/TableBox'
import ModalBox from './components/Modal'
import SelectBox from './components/SelectBox'
import SelectBoxCondition from './components/SelectBoxCondition'
import InputBox from './components/InputBox'
import Confirms from './components/Confirms/Confirms'
import { asyncConnect } from 'redux-async-connect';
import { fetchSecretQuote,fetchFuturesQuote,fetchFuturesAddrsQuote,operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';

const apiTypes = [{id:'0',value:'CTP'},{id:1,value:'奇正'},{id:2,value:'金牛'},{id:3,value:'知富'},{id:4,value:'博易'}]
const authTypes = [{id:'0',value:'账户密码'},{id:1,value:'IP授权码(非CTP)'}]
const addrTypes = [{id:'0',value:'交易'},{id:1,value:'行情'}]

@asyncConnect([{
promise: ({store: {dispatch, getState}}) => {
  const promises = [];

  if (!getState().FuturesDataQuotes.FuturesData) {
    promises.push(dispatch(fetchFuturesQuote('admin/GetFuturesData')));
  }

  if (!getState().quotes.quote) {
    promises.push(dispatch(fetchSecretQuote('admin/GetFuturesNames')));
  }

  return Promise.all(promises);
}
}])

@connect(
  state => ({
    quote:state.quotes.quote,
    Tips:state.Tips,
    FuturesData : state.FuturesDataQuotes.FuturesData,
    FuturesAddrsData : state.FuturesAddrsDataQuotes.FuturesAddrsData
    }),
  {fetchSecretQuote,operateDataQuote,fetchFuturesQuote,fetchFuturesAddrsQuote,openTips}
)

export default class tradeManage extends Component {

        state = {
            open:false,
            FuturesIDCondition:"",
            AddressFlag:0,
            FuturesData:[],
            authTypes:[{id:0,value:'账户密码'}],
          }

        componentWillMount = () => {
            if(this.props.FuturesData){
                this.setState({
                    FuturesData:this.props.FuturesData
                })
            }
            var me = this
            this.tradeSystemtableHeader = 
            [{key:'FuturesName',value:"交易系统名称"}, 
            {key:'BrokerID',value:"经纪公司代码"}, 
            {key:'ApiType',value:"接口类型",selectedView:{0:'CTP',1:'奇正',2:'金牛',3:'知富',4:'博易'}}, 
            {key:'AuthType',value:"授权类型",selectedView:{0:'账户密码',1:'IP授权码'}},  
            {key:'AuthCode',value:"授权码"},
            {key:'modify',value:"修改",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.modifyModal(index)}>修改</button>}},
            {key:'delete',value:"删除",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.deleteModal(index)}>删除</button>}}
            ]

            this.tradeSystemAddrtableHeader = 
            [{key:'AddressFlag',value:"地址类型",selectedView:{0:'交易',1:'行情'}}, 
            {key:'IP',value:"地址"}, 
            {key:'Port',value:"端口"},
            {key:'modify',value:"修改",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.modifyAddrModal(index)}>修改</button>}},
            {key:'delete',value:"删除",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.deleteAddrModal(index)}>删除</button>}}
            ]
        }

        componentWillReceiveProps =(nextProps) =>{
                this.setState({
                     FuturesData:this.filterdata({FuturesIDCondition:this.state.FuturesIDCondition},nextProps.FuturesData),
                })
               // if(nextProps.FuturesData != this.props.FuturesData){
                
               // }
        }


         FuturesChange = (e) => {
            this.setState({
                FuturesName:e.target.value,
            })
        }
        BrokerChange = (e) => {
            this.setState({
                BrokerID:e.target.value,
            })
        }

        ApiTypeChange = (e) => {
            if (this.state.AuthType==1 && e.target.value==0) {
                this.props.openTips("请先将授权类型改为账户密码")
                e.target.value = this.state.ApiType;
                return;
            };
            this.setState({
                ApiType:e.target.value,
            })
        }
        AuthTypeChange = (e) => {
            // alert(e.target.value)
            // alert(this.state.ApiType)
            if (this.state.ApiType == 0 && e.target.value == 1) {
                this.props.openTips("非CTP类型可选")
                e.target.value = '';
                return             
            }
            this.setState({
                AuthType:e.target.value,
            })
            if (e.target.value == 1) {
                this.changeContent(true);
            } else{
                this.changeContent(false);
            }
        }
        AuthCodeChange = (e) =>{
            if (this.state.ApiType==0) {
                this.props.openTips("非CTP类型可填")
                e.target.value = '';
                return             
            }
            if (this.state.AuthType==0) {
                this.props.openTips("非选择IP授权码")
                e.target.value = '';
                return             
            }
            this.setState({
                AuthCode:e.target.value,
            })
        }

        changeContent =(flag) =>{
            this.setState({
                content:(<form>
                                <InputBox header = '交易系统名称' indeed={true} handleSelect = {this.FuturesChange}/>
                                <InputBox header = '经纪公司代码' indeed={true} handleSelect = {this.BrokerChange}/>
                                <SelectBox header = "接口类型" indeed={true} items={apiTypes} defaultValue="" handleSelect ={this.ApiTypeChange}/>
                                <SelectBox header = "授权类型" indeed={true} items={authTypes} defaultValue="" handleSelect ={this.AuthTypeChange}/>
                                {flag && <InputBox header = '授权码' handleSelect = {this.AuthCodeChange}/>}
                        </form>),
            })
        }

        addModal = () => {
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'交易系统管理--添加新系统',
                modalType:0,
                apiTypes:'',
                authTypes:'',
                AuthCode:'',
                FuturesName:'',
                BrokerID:'',
            });
            this.changeContent();
        }

        AddressFlagChange = (e) => {
            this.setState({
                AddressFlag:e.target.value,
            })
        }

        IPChange = (e) => {
            this.setState({
                IP:e.target.value,
            })
        }

        PortChange = (e) => {
            this.setState({
                Port:e.target.value,
            })
        }

        addAddrModal = () => {
            if(!this.state.FuturesIDAddr){
                this.props.openTips('请选择一条交易系统')
                return
            }
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'交易系统地址--添加新地址',
                modalType:1,
                AddressFlag:'',
                IP:'',
                port:'',
                content:(<form>
                                <SelectBox header = "地址类型" indeed={true} items={addrTypes} defaultValue="" handleSelect ={this.AddressFlagChange}/>
                                <InputBox header = '地址' indeed={true} handleSelect = {this.IPChange}/>
                                <InputBox header = '端口' indeed={true} handleSelect = {this.PortChange}/>
                        </form>),
            });
        }

        modifyModal = (index) => {
            // e.stopPropagation();
            // let index = e.target.name || e.target.getAttribute("name");
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'交易系统管理--修改',
                modalType:0,
                FuturesName:this.state.FuturesData[index].FuturesName,
                FuturesID:this.state.FuturesData[index].FuturesID,
                BrokerID:this.state.FuturesData[index].BrokerID,
                ApiType:this.state.FuturesData[index].ApiType,
                AuthCode:this.state.FuturesData[index].AuthCode,
                AuthType:this.state.FuturesData[index].AuthType,
                content:(<form>
                                <InputBox header = '交易系统名称' indeed={true} defaultValue={this.state.FuturesData[index].FuturesName} handleSelect = {this.FuturesChange}/>
                                <InputBox header = '经纪公司代码' indeed={true} defaultValue={this.state.FuturesData[index].BrokerID} handleSelect = {this.BrokerChange}/>
                                <SelectBox header = "接口类型" indeed={true} defaultValue={this.state.FuturesData[index].ApiType} items={apiTypes} handleSelect ={this.ApiTypeChange}/>
                                <SelectBox header = "授权类型" indeed={true} defaultValue={this.state.FuturesData[index].AuthType} items={authTypes} handleSelect ={this.AuthTypeChange}/>
                                {this.state.FuturesData[index].AuthType == 1 && <InputBox header = '授权码' defaultValue={this.props.FuturesData[index].AuthCode} handleSelect = {this.AuthCodeChange}/>}
                        </form>),
            });
            // e.stopPropagation();
            // e.preventDefault();
        }

        modifyAddrModal = (index) => {
            // e.stopPropagation();
            // let index = e.target.name || e.target.getAttribute("name");
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'交易系统地址--修改地址',
                modalType:1,
                AddressFlag:this.props.FuturesAddrsData[index].AddressFlag,
                IP:this.props.FuturesAddrsData[index].IP,
                Port:this.props.FuturesAddrsData[index].Port,
                addrId:this.props.FuturesAddrsData[index].id,
                content:(<form>
                                <SelectBox header = "地址类型" indeed={true} defaultValue={this.props.FuturesAddrsData[index].AddressFlag} items={addrTypes} handleSelect ={this.AddressFlagChange}/>
                                <InputBox header = '地址' indeed={true} defaultValue={this.props.FuturesAddrsData[index].IP} handleSelect = {this.IPChange}/>
                                <InputBox header = '端口' indeed={true} defaultValue={this.props.FuturesAddrsData[index].Port} handleSelect = {this.PortChange}/>
                        </form>),
            });

        }

        deleteModal = (index) => {
            // e.stopPropagation();
            this.setState({
                deleteurl:'admin/delFuturesData',
                deleteObject:this.state.FuturesData,
				modalType:0,
                deleteid:this.state.FuturesData[index].FuturesID,
                deleteindex:index,
                openConfirms: (this.state.openConfirms == true) ? false : true,
                ConfirmText:`确认要删除交易系统 "${this.state.FuturesData[index].FuturesName}" 吗?`,
            })
        }

        confirm = (e) =>{
            this.setState({ 
                openConfirms: this.state.openConfirms ? false : true,
            })
            this.props.operateDataQuote(this.state.deleteurl,'id='+this.state.deleteid,this.updateView)
        }

        deleteAddrModal = (index) => {
            // e.stopPropagation();
            this.setState({
                deleteurl:'admin/delFuturesAddrData',
                deleteObject:this.props.FuturesAddrsData,
				modalType:1,
                deleteid:this.props.FuturesAddrsData[index].id,
                deleteindex:index,
                openConfirms: (this.state.openConfirms == true) ? false : true,
                ConfirmText:`确认要删除交易地址 "${this.props.FuturesAddrsData[index].IP}" 吗?`,
            })
        }

        submitData = () => {
            if(this.state.modalType==0){

            if (!this.state.FuturesName) {
                this.props.openTips("未填写交易系统名")
                return;
            }

            if (!this.state.BrokerID) {
                this.props.openTips("未填写经纪公司代码")
                return;
            }

            if (!this.state.ApiType) {
                this.props.openTips("未选择接口类型")
                return;
            }
            if (!this.state.AuthType && this.state.AuthType!=0) {
                this.props.openTips("未选择授权类型")
                return;
            }
            if (this.state.AuthCode.length > 64) {
                this.props.openTips("授权码小于64个字符")
                return;
            };

            let body = "FuturesName="+this.state.FuturesName+"&BrokerID="+this.state.BrokerID+"&ApiType="+this.state.ApiType+"&AuthCode="+this.state.AuthCode+"&AuthType="+this.state.AuthType;
            if(this.state.head == '交易系统管理--添加新系统'){
                var addon = "&operateType=ADD"
            }else{
                var addon = "&FuturesID="+this.state.FuturesID+"&operateType=MODIFY"
            }
            this.props.operateDataQuote('admin/FuturesData',`${body}${addon}`,this.updateView)
            } else if(this.state.modalType==1){
                if (!/[\d\.]/.test(this.state.IP)) {
                this.props.openTips("未填写地址")
                return;
                }

                if (!this.state.AddressFlag) {
                this.props.openTips("未选择地址类型")
                return;
                }

                if (this.state.Port > 70000 || !this.state.Port || typeof this.state.Port != 'number' && (this.state.Port % 1 != 0) ) {
                    this.props.openTips("未填写端口或端口格式不正确")
                    return;
                }
                if (!this.state.FuturesIDAddr) {
                    this.props.openTips("未选择交易系统")
                    return;
                }
                let body = "AddressFlag="+this.state.AddressFlag+"&Port="+this.state.Port+"&IP="+this.state.IP+"&FuturesID="+this.state.FuturesIDAddr;
                if(this.state.head == '交易系统地址--添加新地址'){
                    var addon = "&operateType=ADD"
                }else{
                    var addon = "&id="+this.state.addrId+"&operateType=MODIFY"
                }
                this.props.operateDataQuote('admin/FuturesAddrData',`${body}${addon}`,this.updateView)
            }

            this.setState({ 
                open: (this.state.open == true) ? false : true,
            })
        }

        filterdata = (type)=>{
            var data = this.props.FuturesData.concat();
            var num = data.length
            for (var i = 0; i < num; i++) {
                var index = i-(num-data.length)
                if(type.FuturesIDCondition != data[index].FuturesName && type.FuturesIDCondition !== ''){
                    data.splice(index,1)
                }
            };
            return data
        }

         futuresChangeStatus = (e) =>{
            var value = e.target.value
            this.setState({
                FuturesIDCondition:value,
                FuturesData:this.filterdata({FuturesIDCondition:value})
            })
        }

        accountTypeChangeStatus = (e) =>{
            this.setState({
                AccountTypeCondition:e.target.value
            })
        }

        showAddrInfo = (e) =>{
            let id = e.target.parentNode.getAttribute("value")
            this.setState({
                FuturesIDAddr:id,
            })
            this.props.fetchFuturesAddrsQuote('admin/GetFuturesAddrs','FuturesID='+id)
        }

        static propTypes = {

        }

        updateView = ()=>{
            if (this.props.Tips.tipText.id==0) {
                if (this.state.modalType==0) {
                    this.props.fetchFuturesQuote('admin/GetFuturesData')
                    this.props.fetchSecretQuote('admin/GetFuturesNames')
                    if(this.state.FuturesIDAddr){this.props.fetchFuturesAddrsQuote('admin/GetFuturesAddrs','FuturesID='+this.state.FuturesIDAddr)} 
                } else if (this.state.modalType==1) { 
                   this.props.fetchFuturesAddrsQuote('admin/GetFuturesAddrs','FuturesID='+this.state.FuturesIDAddr) 
                } else{
                    // this.state.deleteObject.splice(this.state.deleteindex,1);
                }
            };
        }

        render() {
            // console.log(this.state.FuturesData)
            return <div>
            <button className = "btn btn-primary pull-right" onClick={this.addModal} style={{marginBottom:'5px'}}> 添加 < /button> 
            <SelectBoxCondition header = "交易系统" items={this.props.quote} selectValue="" handleSelect ={this.futuresChangeStatus}/>
            < TableBox tableHeader = { this.tradeSystemtableHeader }
            data = { this.state.FuturesData }
            modifyModal = { this.modifyModal }
            deleteModal = { this.deleteModal }
            chooseOne = { this.showAddrInfo }
            /><button className = "btn btn-primary pull-right" onClick={this.addAddrModal} style={{marginBottom:'5px',clear:'both'}}> 添加 < /button> 
            < TableBox tableHeader = { this.tradeSystemAddrtableHeader }
            data = { this.props.FuturesAddrsData }
            modifyModal = { this.modifyAddrModal }
            deleteModal = { this.deleteAddrModal }
            PageNavBar = { true }
            /> < ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.submitData }
            /> <Confirms confirm={this.confirm} head={this.state.confirmHead} ConfirmText={this.state.ConfirmText} open = {this.state.openConfirms} /></div> 
        }
    }



