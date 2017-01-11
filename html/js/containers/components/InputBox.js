import React from 'react'

const InputBox =(props)=>
( 
< div className = "input-group form-group" style={{width:'100%'}}>
< label className = "input-group-addon" style={{width:'120px'}}> { props.header }{props.indeed && <span className="pull-left" style={{color:'red'}}>*</span>}:< /label> < input className = "form-control"
onChange = { props.handleSelect } placeholder = {props.placeHolder} defaultValue={props.defaultValue} /> < /div >
)
 
export default InputBox

InputBox.PropTypes = {
    header: React.PropTypes.string,
}