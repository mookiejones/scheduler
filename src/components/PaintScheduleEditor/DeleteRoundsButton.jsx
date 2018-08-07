import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';

export default class DeleteRoundsButton extends PureComponent {
  state = {
    show: false
  };

  render() {
    const { show } = this.state;
    const { handleDeleteRound, items } = this.props;

    return (
      <div>
        <Modal
          show={show}
          onHide={() =>
            this.setState({
              show: false
            })
          }>
          <ModalHeader closeButton> Delete Rounds ? </ModalHeader>{' '}
          <ModalBody>
            {' '}
            {items.length > 0
              ? 'Unsaved rows will be lost! Continue?'
              : 'Would you like to delete rows?'}{' '}
          </ModalBody>{' '}
          <ModalFooter>
            <Button
              onClick={() => {
                this.setState({
                  show: false
                });
                handleDeleteRound();
              }}>
              Ok{' '}
            </Button>{' '}
            <Button
              onClick={() =>
                this.setState({
                  show: false
                })
              }>
              Cancel{' '}
            </Button>{' '}
          </ModalFooter>{' '}
        </Modal>
        {items.length > 0 && (
          <Button
            bsStyle="primary"
            onClick={() => {
              this.setState({
                show: true
              });
            }}>
            Delete Rounds
          </Button>
        )}
      </div>
    );
  }
}

DeleteRoundsButton.propTypes = {
  items: PropTypes.array,
  handleDeleteRound: PropTypes.func.isRequired
};
