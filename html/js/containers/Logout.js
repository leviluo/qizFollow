// components/Logout.js

import React, { Component, PropTypes } from 'react'

export default class Logout extends Component {

  render() {
    const { onLogoutClick } = this.props

    return (
      <button onClick={() => onLogoutClick()} className="btn btn-primary" style={{marginTop:'8px',float:'right'}}>
        退出
      </button>
    )
  }

}

Logout.propTypes = {
  onLogoutClick: PropTypes.func.isRequired
}