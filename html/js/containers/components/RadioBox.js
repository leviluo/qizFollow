
import React, { Component, PropTypes } from 'react'

export default class radioBox extends Component{

        render() {
            const {items,header} = this.props;
            let itemss = [];
            for (var i = 0; i < items.length; i++) {
                let flag = this.props.defaultValue == items[i].id ? true : false;
                itemss.push(<label key={i}><input type="radio" name={this.props.name} defaultChecked={flag} value={items[i].id} onChange={this.props.handleRadio}/>{items[i].value}</label>)
                }
                return ( <div className="form-group" style={{width:'100%'}}>
                            <label className="form-control" style={{width:'120px',display:'inline-block',marginRight:'10px',background:'#efefef',textAlign:'center',fontWeight:'normal'}}>{header}{this.props.indeed && <span className="pull-left" style={{color:'red'}}>*</span>}:</label>
                                <span>{itemss}</span>
                        </div>
                )
            }
}

radioBox.PropTypes = {
    items: React.PropTypes.array,
    header: React.PropTypes.string,
}