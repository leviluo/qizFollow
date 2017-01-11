import React, { Component, PropTypes } from 'react'
import { Button,Modal} from 'react-bootstrap';

export default class ModalBox extends Component{

  state = {openstate: true};

  hideModal =() => {
    this.setState({openstate: this.state.openstate == false ? true :false});
  }

  render() {
    const {content,open,head} =this.props
    return (
      <Modal show={open == this.state.openstate} 
          dialogClassName="custom-modal" animation={true}
        >
          <Modal.Header style={{textAlign:'center'}}>
            <Modal.Title id="contained-modal-title-lg">{head}
              <button className="close" onClick={this.hideModal}>&times;</button>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {content}
          </Modal.Body>
          <Modal.Footer>
            <Button className="btn-primary" style={{width:'100%'}}onClick={this.props.submitData}>提交</Button>
          </Modal.Footer>
        </Modal>
    );
  }
}
