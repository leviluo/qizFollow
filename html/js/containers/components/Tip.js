import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux';
import { closeTips } from '../../actions/fetchSecretQuote';

@connect(
  state => ({
    // dispatch:state.dispatch,
    }),
  {closeTips}
)

export default class Tip extends Component {

    componentWillMount = () => {
        let that = this;
        setTimeout(function() {
            that.close();
        }, 2000)
        if (this.props.text.id==0 && this.props.update) {
            this.props.update();
        };
    }
    
    componentDidMount = () => {
        document.getElementById('tips').style.left = ((document.body.clientWidth - document.getElementById('tips').offsetWidth) / 2) + 'px';
    }

    componentWillUpdate() {

    }

    close = () =>{
        this.props.closeTips();
    }

    static PropTypes = {
        // text: React.PropTypes.string,
    }

    render() {
        return ( < div id = "tips"
            style = {
                { padding: '0 10px', clear: 'both', height: '35px', position: 'absolute', zIndex: '9999', lineHeight: '35px', backgroundColor: 'rgba(0,139,0,1)', textAlign: 'center', color: 'white', borderRadius: '5px' } } > { this.props.text.msg || this.props.text} < button onClick = { this.close }
            className = "close"
            style = {
                { margin: '7px',color:'white' } } > &times; < /button></div >
        )
    }
}
