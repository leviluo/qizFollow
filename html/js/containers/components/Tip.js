import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { closeTips } from '../../actions/fetchSecretQuote';
import {findDOMNode } from 'react-dom'

@connect(
  state => ({
    tips:state.Tips,
    }),
  {closeTips}
)

export default class Tip extends Component {

    componentWillMount = () => {
        // console.log("componentWillMount")
    }
    
    componentDidUpdate = (e) => {
        findDOMNode(this).style.left = ((document.body.clientWidth-window.getComputedStyle(findDOMNode(this),null).width.slice(0,-2)) / 2) + 'px';
        findDOMNode(this).style.top = (document.body.scrollTop + 60) + 'px';
    }

    componentWillUpdate() {

    }

    shouldComponentUpdate(nextProps){
        if(nextProps==this.props)return false
        let that = this;
    console.log(nextProps.tips)
        if(nextProps.tips.tipText.msg) {
            this.showTip("#FF7F00")
            if(this.setIn)clearInterval(this.setIn)
            this.setIn = setTimeout(()=>{
            that.hideTip();
            }, 2000)
        }else{
            return false
        }
        return true
    }

    componentWillReceiveProps =()=>{
        // console.log("componentWillReceiveProps")
        // console.log(this.props)
    }

    hideTip = () =>{
        findDOMNode(this).style.display = "none";
    }

    showTip = (color)=>{
        findDOMNode(this).style.display = "block";
        findDOMNode(this).style.background = color;
    }

    static propTypes = {
        tips: React.PropTypes.object.isRequired,
    }

    render() {
        
        // console.log(tips)
        return ( < div id = "tips"
            style = {
                { padding: '0 10px', clear: 'both', display:"none", height: '35px', position: 'absolute', zIndex: '9999', lineHeight: '35px', textAlign: 'center', color: 'white', borderRadius: '5px' } } >{this.props.tips.tipText.msg}< button onClick = { this.close }
            className = "close"
            style = {
                { margin: '7px',color:'white' } } > &times; < /button></div >
        )
    }
}
