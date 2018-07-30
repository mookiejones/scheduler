import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';

/**
 * @class AddNewRoundButton
 */
class AddNewRoundButton extends Component {
  state = {
    show: false
  };
  handleClose(e) {
    debugger;
  }

  render() {
    const { show } = this.state;
    const { handleAddNewRound, newRows } = this.props;

    return (
      <div>
        <Modal show={show} onHide={() => this.setState({ show: false })}>
          <ModalHeader closeButton>Add New Round?</ModalHeader>
          <ModalBody>
            {newRows > 0
              ? 'Unsaved rows will be lost! Continue?'
              : 'Would you like to add new rows?'}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                this.setState({ show: false });
                handleAddNewRound();
              }}>
              Ok
            </Button>
            <Button onClick={() => this.setState({ show: false })}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Button
          bsStyle="primary"
          onClick={() => {
            this.setState({ show: true });
          }}>
          New Round
        </Button>
      </div>
    );
  }
}
AddNewRoundButton.propTypes = {
  newRows: PropTypes.any.isRequired,
  handleAddNewRound: PropTypes.func.isRequired
};

export default AddNewRoundButton;
