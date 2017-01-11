
import React, { Component, PropTypes } from 'react'

export default class SelectBoxCondition extends Component{

        handleSelect(){
            // alert('okkk')
        }

        render() {
            const {items,header} = this.props;
            var itemss = [];
            for (var i = 0; i < items.length; i++) {
                itemss.push( < option key = { i }
                    value = { items[i].value } > { items[i].value } < /option>);
                }
                return ( <span>
                    < label className="control-label" style={{padding:'6px'}}> { header }:< /label> < select className = "form-control"
                    onChange = { this.props.handleSelect } defaultValue={ this.props.defaultValue } style={{width:'120px',display:'inline-block'}}> <option value="">-- 全部 --</option> { itemss } < /select></span>
                )
            }
}

SelectBoxCondition.PropTypes = {
    items: React.PropTypes.array,
    header: React.PropTypes.string,
}