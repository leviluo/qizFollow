webpackJsonp([5],{544:function(e,t,a){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function o(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var s,c,u,l,p,f=function(){function e(e,t){for(var a=0;a<t.length;a++){var i=t[a];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,a,i){return a&&e(t.prototype,a),i&&e(t,i),t}}(),d=a(1),h=i(d),g=a(518),y=i(g),C=a(163),m=a(519),T=a(198),v=a(210),D=(s=(0,T.asyncConnect)([{promise:function(e){var t=e.store,a=t.dispatch,i=t.getState,n=[];return i().ConfigsQuotes.ConfigsData||n.push(a((0,m.fetchConfigsDataQuote)("admin/GetConfigsData"))),Promise.all(n)}}]),c=(0,C.connect)(function(e){return{ConfigsData:e.ConfigsQuotes.ConfigsData,Tips:e.Tips,auth:e.auth}},{fetchConfigsDataQuote:m.fetchConfigsDataQuote,operateDataQuote:m.operateDataQuote,openTips:m.openTips}),s(u=c((p=l=function(e){function t(){var e,a,i,o;n(this,t);for(var s=arguments.length,c=Array(s),u=0;u<s;u++)c[u]=arguments[u];return a=i=r(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),i.state={TipState:!1},i.componentWillMount=function(){if(!i.props.auth.isAuthenticated)return void v.browserHistory.push("/login")},i.OrderLimitDelayChange=function(e){i.setState({OrderLimitDelay:e.target.value})},i.OpenPriceTickChange=function(e){i.setState({OpenPriceTick:e.target.value})},i.ClosePriceTickChange=function(e){i.setState({ClosePriceTick:e.target.value})},i.submitData=function(){var e="";if(!(parseInt(i.state.OrderLimitDelay)>=0))return void i.props.openTips("下单不成交追单时间必须大于0");if(e+="OrderLimitDelay="+parseInt(i.state.OrderLimitDelay)+"&",i.state.OpenPriceTick>=-10&&i.state.OpenPriceTick<=10)e+="OpenPriceTick="+i.state.OpenPriceTick+"&";else if(i.state.OpenPriceTick)return void i.props.openTips("开仓优化价格点数范围不正确");if(i.state.ClosePriceTick>=-10&&i.state.ClosePriceTick<=10)e+="ClosePriceTick="+i.state.ClosePriceTick+"&";else if(i.state.ClosePriceTick)return void i.props.openTips("平仓优化价格点数范围不正确");return e?void i.props.operateDataQuote("admin/Configs",""+e,i.updateView):void i.props.openTips("未做任何的更改")},i.updateView=function(){i.props.fetchConfigsDataQuote("admin/GetConfigsData")},o=a,r(i,o)}return o(t,e),f(t,[{key:"componentWillReceiveProps",value:function(){}},{key:"render",value:function(){if(!this.props.ConfigsData)return h.default.createElement("div",null," ");for(var e=0;e<this.props.ConfigsData.length;e++)if("OrderLimitDelay"==this.props.ConfigsData[e].KeyName)var t=this.props.ConfigsData[e].KeyValue;else if("OpenPriceTick"==this.props.ConfigsData[e].KeyName)var a=this.props.ConfigsData[e].KeyValue;else if("ClosePriceTick"==this.props.ConfigsData[e].KeyName)var i=this.props.ConfigsData[e].KeyValue;return h.default.createElement("div",null,h.default.createElement("div",{className:"col-md-4 col-md-offset-4"},h.default.createElement(y.default,{header:"不成交追单时间(ms)",defaultValue:t,handleSelect:this.OrderLimitDelayChange})," ",h.default.createElement(y.default,{header:"开仓优化价格点数(-10 ~ 10)",defaultValue:a,handleSelect:this.OpenPriceTickChange})," ",h.default.createElement(y.default,{header:"平仓优化价格点数(-10 ~ 10)",defaultValue:i,handleSelect:this.ClosePriceTickChange})," ",h.default.createElement("button",{className:"btn btn-primary",style:{display:"block",margin:"0 auto"},onClick:this.submitData}," 保存 ")," "))}}]),t}(d.Component),l.propTypes={dispatch:d.PropTypes.func.isRequired,errorMessage:d.PropTypes.string},u=p))||u)||u);t.default=D}});