import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
 Label, Panel, ListGroup, ListGroupItem
} from 'react-bootstrap';

export default class ListTop extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentRoundNumber: 0,
      currentRevision: 0
    };
  }

  getPaintLabel() {
    const result = this.props.role === 'load' ? 'Load' : this.props.role === 'stage' ? 'Staging' : 'Pick';
    return `Paint ${result} List `;
  }

  getEnvironmentLabel() {
    return this.props.environment === 'production' ? '' : `(${this.props.environment})`;
  }

  getCurrentRoundLabel() {
    debugger;
  }

  render() {
    const paintLabel = this.getPaintLabel();
    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>{paintLabel}</Panel.Title>
        </Panel.Heading>

        <ListGroup>
          <ListGroupItem>
            <h3>
              <span>Current Round:</span>
              <Label bsStyle='primary' style={{ marginLeft: '57px' }}>
                {this.state.currentRoundNumber}
              </Label>
            </h3>
            <h3>
              <span>Schedule Revision: </span>
              <Label bsStyle='primary' style={{ marginLeft: '15px' }}>
                {this.state.currentRevision}
              </Label>
            </h3>
          </ListGroupItem>
        </ListGroup>
      </Panel>
    );
  }
}

ListTop.propTypes = {
  currentRevision: PropTypes.string,
  currentRoundNumber: PropTypes.string,
  environment: PropTypes.string,
  role: PropTypes.string,
  connectionState: PropTypes.string
};
