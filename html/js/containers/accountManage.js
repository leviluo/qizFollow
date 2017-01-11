import React, { Component, PropTypes } from 'react'
import TableBox from './components/TableBox'
import ModalBox from './components/Modal'
import SelectBox from './components/SelectBox'
import SelectBoxCondition from './components/SelectBoxCondition'
import InputBox from './components/InputBox'
import RadioBox from './components/RadioBox'
import TextareaBox from './components/TextareaBox'
import Tip from './components/Tip'
import { asyncConnect } from 'redux-async-connect';
import { fetchSecretQuote,fetchDataQuote,operateDataQuote,openTips } from '../actions/fetchSecretQuote';
import { connect } from 'react-redux';
import Confirms from './components/Confirms/Confirms'


const statusitems = [{id:0,value:'启用'},{id:1,value:'停用'}]
const accounttypes = [{id:0,value:'主账户'},{id:1,value:'从账户'}]


@asyncConnect([{
promise: ({store: {dispatch, getState}}) => {
  const promises = [];

  if (!getState().quotes.quote) {
    promises.push(dispatch(fetchSecretQuote('admin/GetFuturesNames')));
  }

  if (!getState().dataQuotes.dataQuoteResult) {

    promises.push(dispatch(fetchDataQuote('admin/GetAccountData')));
  }

  return Promise.all(promises);
}
}])

@connect(
  state => ({
    dataQuoteResult:state.dataQuotes.dataQuoteResult,
    Tips:state.Tips,
    quote:state.quotes.quote,
    }),
  {operateDataQuote,openTips,fetchDataQuote}
)

export default class accountManage extends Component {

        state = {
            open:false,
            Remark:'',
            Status:0,
            AccountType:0,
            FuturesIDCondition:"",
            AccountTypeCondition:"",
            data:[],
          }

        componentWillMount = () => {
            if (this.props.dataQuoteResult) {
                this.setState({
                    data:this.props.dataQuoteResult
                })
            };
            var me = this;
           this.tableHeader = [{key:'Account',value:"账户"}, 
            {key:'accountName',value:"别名"}, 
            {key:'AccountType',value:"账户类型",selectedView:{0:"主账户",1:"从账户"}}, 
            {key:'Status',value:"状态",selectedView:{0:'启用',1:'关闭'}},
            {key:'Password',value:"密码"},{key:'FuturesName',value:"交易系统名称"},
            {key:'updatetime',value:"更新时间"},{key:'Remark',value:"备注"},
            {key:'modify',value:"修改",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.modifyModal(index)}>修改</button>}},
            {key:'delete',value:"删除",extendsMethod:function(value,index){return <button className="btn btn-default" onClick={()=>me.deleteModal(index)}>删除</button>}}
            ]
        }

        componentWillReceiveProps =(nextProps) =>{
            this.setState({
                    data:nextProps.dataQuoteResult,
                    FuturesIDCondition:"",
                    AccountTypeCondition:"",
                })
        }

        accountChange = (e) => {
            this.setState({
                Account:e.target.value,
            })
        }
        accountNameChange = (e) => {
            this.setState({
                accountName:e.target.value,
            })
        }
        passwordChange = (e) => {
            this.setState({
                Password:e.target.value,
            })
        }
        statusChange = (e) => {
            this.setState({
                Status:e.target.value || 1,
            })
        }
        typeChange = (e) => {
            this.setState({
                AccountType:e.target.value,
            })
        }
        textareaChange = (e) => {
            this.setState({
                Remark:e.target.value,
            })
        }
        futuresChange = (e) => {
            this.setState({
                FuturesID:e.target.value,
            })
        }
        addModal = () => {
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'账户管理--添加',
                FuturesID:'',
                Remark:'',
                Status:0,
                AccountType:0,
                Password:'',
                Account:'',
                accountName:'',
                content:(<form>
                                <SelectBox header = "交易系统" indeed={true} defaultValue="" items={this.props.quote} handleSelect ={this.futuresChange}/>
                                <InputBox header = '账户' indeed={true} handleSelect = {this.accountChange}/>
                                <InputBox header = '别名' handleSelect = {this.accountNameChange}/>
                                <RadioBox header = '状态' name="status" indeed={true} defaultValue="0" items={statusitems} handleRadio = {this.statusChange}/>
                                <InputBox header = '密码' indeed={true} handleSelect = {this.passwordChange}/>
                                <RadioBox header = '类型' name="type"  indeed={true} defaultValue="0" items={accounttypes} handleRadio = {this.typeChange}/>
                                <TextareaBox header = '备注' handleTextarea = {this.textareaChange}/>
                        </form>),
            });
        }

        modifyModal = (index) => {
            // let index = e.target.name || e.target.getAttribute("name");
            this.setState({
                open: (this.state.open == true) ? false : true,
                head:'账户管理--修改',
                AccountID:this.props.dataQuoteResult[index].AccountID,
                FuturesID:this.props.dataQuoteResult[index].FuturesID,
                Status:this.props.dataQuoteResult[index].Status,
                AccountType:this.props.dataQuoteResult[index].AccountType,
                Remark:this.props.dataQuoteResult[index].Remark,
                Account:this.props.dataQuoteResult[index].Account,
                Password:this.props.dataQuoteResult[index].Password,
                accountName:this.props.dataQuoteResult[index].accountName,
                content:(<form>
                                <SelectBox header = "交易系统" indeed={true} items={this.props.quote} defaultValue={this.props.dataQuoteResult[index].FuturesID} handleSelect ={this.futuresChange}/>
                                <InputBox header = '账户' indeed={true} defaultValue={this.props.dataQuoteResult[index].Account} handleSelect = {this.accountChange}/>
                                <InputBox header = '别名' defaultValue={this.props.dataQuoteResult[index].accountName} handleSelect = {this.accountNameChange}/>
                                <RadioBox header = '状态' name="status" indeed={true} items={statusitems} defaultValue = {this.props.dataQuoteResult[index].Status} handleRadio = {this.statusChange}/>
                                <InputBox header = '密码' indeed={true} defaultValue={this.props.dataQuoteResult[index].Password} handleSelect = {this.passwordChange}/>
                                <RadioBox header = '类型' name="type" indeed={true} items={accounttypes} defaultValue = {this.props.dataQuoteResult[index].AccountType} handleRadio = {this.typeChange}/>
                                <TextareaBox header = '备注' defaultValue={this.props.dataQuoteResult[index].Remark} handleTextarea = {this.textareaChange}/>
                        </form>),
            });
        }

        deleteModal = (index) => {
            this.setState({
                deleteurl:'admin/delAccountData',
                deleteObject:this.props.dataQuoteResult,
                deleteid:this.props.dataQuoteResult[index].AccountID,
                deleteindex:index,
                openConfirms: (this.state.openConfirms == true) ? false : true,
                ConfirmText:`确认要删除账户"${this.props.dataQuoteResult[index].Account}" 吗?`,
            })
        }

        confirm = (e) =>{
            this.setState({ 
                openConfirms: this.state.openConfirms ? false : true,
            })
            this.props.operateDataQuote(this.state.deleteurl,'AccountID='+this.state.deleteid)
        }

        submitData = () => {
            if (!this.state.FuturesID) {
                this.props.openTips('未选择交易系统')
                return;
            }
            if (!this.state.Account) {
                this.props.openTips('未填写账户')
                return;
            }
            if (!this.state.Password) {
                this.props.openTips('未填写密码')
                return;
            }
            let body = "Account="+this.state.Account+"&Status="+this.state.Status+"&Password="+this.state.Password+"&accountName="+this.state.accountName+"&AccountType="+this.state.AccountType+"&FuturesID="+this.state.FuturesID+"&Remark="+this.state.Remark;
            if(this.state.head == '账户管理--添加'){
                var addon = "&operateType=ADD"
            }else{
                var addon = "&AccountID="+this.state.AccountID+"&operateType=MODIFY"
            }

            this.setState({ 
                open: (this.state.open == true) ? false : true,
            })
            
            this.props.operateDataQuote('admin/AccountData',`${body}${addon}`)
        }

        // componentWillUpdate() {
          
        // } 

        filterdata = (type)=>{
            if (type.FuturesIDCondition != undefined) {
                var FuturesIDCondition = type.FuturesIDCondition
                var AccountTypeCondition = this.state.AccountTypeCondition
            } else if (type.AccountTypeCondition != undefined) {
                var AccountTypeCondition = type.AccountTypeCondition
                var FuturesIDCondition = this.state.FuturesIDCondition
            };
            var data = this.props.dataQuoteResult.concat();
            var num = data.length
            for (var i = 0; i < num; i++) {
                var index = i-(num-data.length)
                if((FuturesIDCondition != data[index].FuturesName && FuturesIDCondition !== '' ) || (AccountTypeCondition != data[index].AccountType && (AccountTypeCondition !== '' ) ) ){
                    data.splice(index,1)
                }
            };
            return data
        }

        futuresChangeStatus = (e) =>{
            var value = e.target.value
            this.setState({
                FuturesIDCondition:value,
                data:this.filterdata({FuturesIDCondition:value})
            })
        }

        accountTypeChangeStatus = (e) =>{
            if (e.target.value == '主账户') {
                var value = 0
            }else if(e.target.value == '从账户'){
                var value = 1
            }else{
                var value = e.target.value
            }
            this.setState({
                AccountTypeCondition:value,
                data:this.filterdata({AccountTypeCondition:value})
            })
        }

        updateView = () =>{
            this.props.fetchDataQuote('admin/GetAccountData')
        }

        static propTypes = {
          // dispatch: PropTypes.func.isRequired,
          // quote: PropTypes.array,   
          // dataQuoteResult: PropTypes.array,   
          // isAuthenticated: PropTypes.bool.isRequired,
          // errorMessage: PropTypes.string,
        }

        render() {
           // console.log(this.state.data)
            return <div>{ this.props.Tips.tipstate && <Tip text={this.props.Tips.tipText} update={this.updateView}/>}
            <SelectBoxCondition header = "交易系统" items={this.props.quote} defaultValue="" handleSelect ={this.futuresChangeStatus}/>
            <SelectBoxCondition header = "账户类型" items={accounttypes} defaultValue="" handleSelect ={this.accountTypeChangeStatus}/>
            <button className = "btn btn-primary pull-right" onClick={this.addModal} style={{marginBottom:'5px'}}> 添加 < /button> 
            < TableBox tableHeader = { this.tableHeader }
            data = { this.state.data }
            addModal = { this.addModal }
            modifyModal = { this.modifyModal }
            deleteModal = { this.deleteModal }
            /> < ModalBox open = { this.state.open }
            content = { this.state.content }
            head = { this.state.head }
            submitData = { this.submitData }
            /> <Confirms confirm={this.confirm} head={this.state.confirmHead} ConfirmText={this.state.ConfirmText} open = {this.state.openConfirms} /> </div> 
        }
    }
