
import React, { Component, PropTypes } from 'react'

export default class SelectBox extends Component{

        handleSelect(){
            alert('okkk')
        }

        getValue=()=>{
            return this.refs.myValue.value
        }

        render() {
            const {items,header} = this.props;
            // console.log(this.props.defaultValue)
            // console.log(this.props.items)
            var itemss = [];
                for (var i = 0; i < items.length; i++) {
                itemss.push( < option key = { i }
                    value = { items[i].id || items[i].value } > { items[i].value } < /option>);
                }
                return ( < div className = "input-group form-group" style={{width:'100%'}}>
                    < label className = "input-group-addon" style={{width:'120px'}}> { header }{this.props.indeed && <span className="pull-left" style={{color:'red'}}>*</span>}:< /label> < select id={this.props.id} ref="myValue" className = "form-control"
                    onChange = { this.props.handleSelect } defaultValue={ this.props.defaultValue }> <option value="">-- 请选择 --</option>{ itemss } < /select> < /div >
                )
            }
}

SelectBox.PropTypes = {
    items: React.PropTypes.array,
    header: React.PropTypes.string,
    defaultValue: React.PropTypes.string,
}