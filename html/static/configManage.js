webpackJsonp([5],{544:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s,c,l,p,u,f=function(){function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,a,i){return a&&e(t.prototype,a),i&&e(t,i),t}}(),d=a(1),h=i(d),m=a(518),y=i(m),g=a(163),C=a(519),T=a(520),D=i(T),v=a(198),P=(s=(0,v.asyncConnect)([{promise:function(e){var t=e.store,a=t.dispatch,i=t.getState,n=[];return i().ConfigsQuotes.ConfigsData||n.push(a((0,C.fetchConfigsDataQuote)("admin/GetConfigsData"))),Promise.all(n)}}]),c=(0,g.connect)(function(e){return{ConfigsData:e.ConfigsQuotes.ConfigsData,Tips:e.Tips}},{fetchConfigsDataQuote:C.fetchConfigsDataQuote,operateDataQuote:C.operateDataQuote,openTips:C.openTips}),s(l=c((u=p=function(e){function t(){var e,a,i,o;n(this,t);for(var s=arguments.length,c=Array(s),l=0;l<s;l++)c[l]=arguments[l];return a=i=r(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),i.state={TipState:!1},i.componentWillMount=function(){},i.OrderLimitDelayChange=function(e){i.setState({OrderLimitDelay:e.target.value})},i.OpenPriceTickChange=function(e){i.setState({OpenPriceTick:e.target.value})},i.ClosePriceTickChange=function(e){i.setState({ClosePriceTick:e.target.value})},i.submitData=function(){var e="";if((i.state.OrderLimitDelay||0==i.state.OrderLimitDelay)&&(e+="OrderLimitDelay="+i.state.OrderLimitDelay+"&"),i.state.OpenPriceTick>=-10&&i.state.OpenPriceTick<=10)e+="OpenPriceTick="+i.state.OpenPriceTick+"&";else if(i.state.OpenPriceTick)return void i.props.openTips("开仓优化价格点数范围不正确");if(i.state.ClosePriceTick>=-10&&i.state.ClosePriceTick<=10)e+="ClosePriceTick="+i.state.ClosePriceTick+"&";else if(i.state.ClosePriceTick)return void i.props.openTips("平仓优化价格点数范围不正确");return e?void i.props.operateDataQuote("admin/Configs",""+e):void i.props.openTips("未做任何的更改")},i.updateView=function(){i.props.fetchConfigsDataQuote("admin/GetConfigsData")},o=a,r(i,o)}return o(t,e),f(t,[{key:"componentWillReceiveProps",value:function(){}},{key:"render",value:function(){if(!this.props.ConfigsData)return h.default.createElement("div",null," ");for(var e=0;e<this.props.ConfigsData.length;e++)if("OrderLimitDelay"==this.props.ConfigsData[e].KeyName)var t=this.props.ConfigsData[e].KeyValue;else if("OpenPriceTick"==this.props.ConfigsData[e].KeyName)var a=this.props.ConfigsData[e].KeyValue;else if("ClosePriceTick"==this.props.ConfigsData[e].KeyName)var i=this.props.ConfigsData[e].KeyValue;return h.default.createElement("div",null,this.props.Tips.tipstate&&h.default.createElement(D.default,{text:this.props.Tips.tipText,update:this.updateView}),h.default.createElement("div",{className:"col-md-4 col-md-offset-4"},h.default.createElement(y.default,{header:"不成交追单时间(ms)",defaultValue:t,handleSelect:this.OrderLimitDelayChange})," ",h.default.createElement(y.default,{header:"开仓优化价格点数(-10 ~ 10)",defaultValue:a,handleSelect:this.OpenPriceTickChange})," ",h.default.createElement(y.default,{header:"平仓优化价格点数(-10 ~ 10)",defaultValue:i,handleSelect:this.ClosePriceTickChange})," ",h.default.createElement("button",{className:"btn btn-primary",style:{display:"block",margin:"0 auto"},onClick:this.submitData}," 保存 ")," "))}}]),t}(d.Component),p.propTypes={dispatch:d.PropTypes.func.isRequired,errorMessage:d.PropTypes.string},l=u))||l)||l);t.default=P}});