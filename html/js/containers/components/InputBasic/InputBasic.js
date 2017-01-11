import React from 'react'

const InputBasic =(props)=>(
    < input style={{'boxShadow': 'inset 0 1px 1px rgba(0, 0, 0, .075)',margin: '5px',width: '200px',height: '40px',background: '#efefef',
     border: 'none',textIndent: '5px'}} placeholder={props.header} 
    onChange = { props.handleSelect } defaultValue={props.defaultValue} />
)

export default InputBasic
