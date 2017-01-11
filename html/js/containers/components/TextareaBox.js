import React, { Component, PropTypes } from 'react'

export default class TextareaBox extends Component{

        handleSelect(){
            // alert('okkk')
        }

        render() {
                return (
                    <div className="form-group" style={{width:'100%'}}>
                            <label className="form-control" style={{width:'120px',display:'inline-block',marginRight:'10px',background:'#efefef',textAlign:'center',fontWeight:'normal'}}>{this.props.header}:</label>
                            <textarea name={this.props.header} className="form-control" defaultValue={this.props.defaultValue} onChange={this.props.handleTextarea} cols="30" rows="10"></textarea>
                    </div>
                )
            }
}

TextareaBox.PropTypes = {
    header: React.PropTypes.string,
}