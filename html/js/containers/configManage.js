import React, { Component, PropTypes } from 'react'
import InputBox from './components/InputBox'
import { connect } from 'react-redux'
import { openTips } from '../actions/fetchSecretQuote';
import { fetchConfigsDataQuote, operateDataQuote } from '../actions/fetchSecretQuote';
import Tip from './components/Tip'
import { asyncConnect } from 'redux-async-connect';

@asyncConnect([{
promise: ({store: {dispatch, getState}}) => {
  const promises = [];

  if (!getState().ConfigsQuotes.ConfigsData) {
    promises.push(dispatch(fetchConfigsDataQuote('admin/GetConfigsData')));
  }

  return Promise.all(promises);
}
}])

@connect(
  state => ({
    ConfigsData:state.ConfigsQuotes.ConfigsData,
    Tips:state.Tips
    }),
  {fetchConfigsDataQuote,operateDataQuote,openTips}
)

export default class configManage extends Component {

    state = {
        TipState: false,
    }

    componentWillMount = () => {
        // if (!this.props.ConfigsData) this.props.fetchConfigsDataQuote('admin/GetConfigsData')
    }

    OrderLimitDelayChange = (e) => {
        this.setState({
            OrderLimitDelay: e.target.value
        })
    }

    OpenPriceTickChange = (e) => {
        this.setState({
            OpenPriceTick: e.target.value
        })
    }

    ClosePriceTickChange = (e) => {
        this.setState({
            ClosePriceTick: e.target.value
        })
    }

    submitData = () => {
        let body = '';

        if (this.state.OrderLimitDelay || this.state.OrderLimitDelay == 0) {
            body += "OrderLimitDelay=" + this.state.OrderLimitDelay + '&'
        }

        if (this.state.OpenPriceTick >= -10 && this.state.OpenPriceTick <= 10) {
            body += "OpenPriceTick=" + this.state.OpenPriceTick + '&'
        } else if (this.state.OpenPriceTick) {
            this.props.openTips("开仓优化价格点数范围不正确")
            return
        }

        if (this.state.ClosePriceTick >= -10 && this.state.ClosePriceTick <= 10) {
            body += "ClosePriceTick=" + this.state.ClosePriceTick + '&'
        } else if (this.state.ClosePriceTick) {
            this.props.openTips("平仓优化价格点数范围不正确")
            return
        }

        if (!body) {
            this.props.openTips("未做任何的更改")
            return
        };

        this.props.operateDataQuote('admin/Configs', `${body}`)
    }

    componentWillReceiveProps() {

    }

    updateView =()=>{
           this.props.fetchConfigsDataQuote('admin/GetConfigsData')
    }

    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        // isAuthenticated: PropTypes.bool.isRequired,
        errorMessage: PropTypes.string,
    }


    render() {
            if (this.props.ConfigsData) {
                for (var i = 0; i < this.props.ConfigsData.length; i++) {
                    if (this.props.ConfigsData[i].KeyName == 'OrderLimitDelay') {
                        var OrderLimitDelay = this.props.ConfigsData[i].KeyValue
                    } else if (this.props.ConfigsData[i].KeyName == 'OpenPriceTick') {
                        var OpenPriceTick = this.props.ConfigsData[i].KeyValue
                    } else if (this.props.ConfigsData[i].KeyName == 'ClosePriceTick') {
                        var ClosePriceTick = this.props.ConfigsData[i].KeyValue
                    }
                };
            } 
            else {
                return ( < div > < /div>)
                }

                return ( < div >{ this.props.Tips.tipstate && <Tip text={this.props.Tips.tipText} update={this.updateView}/> }
                 < div className = "col-md-4 col-md-offset-4" >
                        < InputBox header = '不成交追单时间(ms)'
                        defaultValue = { OrderLimitDelay }
                        handleSelect = { this.OrderLimitDelayChange }
                        /> < InputBox header = '开仓优化价格点数(-10 ~ 10)'
                        defaultValue = { OpenPriceTick }
                        handleSelect = { this.OpenPriceTickChange }
                        /> < InputBox header = '平仓优化价格点数(-10 ~ 10)'
                        defaultValue = { ClosePriceTick }
                        handleSelect = { this.ClosePriceTickChange }
                        /> < button className = "btn btn-primary"
                        style = {
                            { display: "block", margin: '0 auto' }
                        }
                        onClick = { this.submitData } > 保存 < /button> < /div >
                        < /div>
                    )
                }
            }


