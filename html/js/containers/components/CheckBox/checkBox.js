import React, { Component, PropTypes } from 'react'

export default class CheckBox extends Component{

        handleCheck =(e)=>{
            // console.log(findDOMNode(this))
            var obj = document.getElementsByName(this.props.name);
            var check_val = [];
            for(var k in obj){
                if(obj[k].checked)
                    check_val.push(obj[k].value);
            }
            this.props.handleCheck(check_val)
        }

        render() {
            const {items,header,value,name} = this.props;
            let itemss = [];
            for (var i = 0; i < items.length; i++) {
                itemss.push(<span key={i}><input type="checkbox" name={name} value={items[i].id} onChange={this.handleCheck}/>{items[i][value]}&nbsp;</span>)
                }
                return ( <div className="form-group" style={{width:'100%'}}>
                            <label className="form-control" style={{width:'120px',display:'inline-block',marginRight:'10px',background:'#efefef',textAlign:'center',fontWeight:'normal'}}>{header}{this.props.indeed && <span className="pull-left" style={{color:'red'}}>*</span>}:</label>
                                <span>{itemss}</span>
                        </div>
                )
            }
}

CheckBox.PropTypes = {
    items: React.PropTypes.array,
    header: React.PropTypes.string,
}