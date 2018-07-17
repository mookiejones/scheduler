import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PaintList from './PaintList';
import LoginDialog from './LoginDialog';
import DataService from '../../api/DataService';

export default class Main extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showDialog: true,
      role: 'assist'
    };
    this.handleLogInAction = this.handleLogInAction.bind(this);
  }

  setUser(userId, name, role) {
    debugger;

    this.setState({ role });
  }

  handleLogInAction(args) {
    const { handleLogin } = this.props;
    this.setState({
      role: args.type
    });
    handleLogin(args);
  }

  shouldComponentUpdate(nextProps) {
    const { route } = nextProps;
    return route === 2;
  }

  render() {
    const { showDialog, role } = this.state;
    const {
 environment, route, handleConnectionStateChanged, currentUser
} = this.props;
    const show = currentUser.name.length === 0 && route === 2;

    const getContent = () => {
      if (currentUser.id && currentUser.id !== -1) {
        return (
          <PaintList
            {...this.props}
            connectionStateChanged={handleConnectionStateChanged}
            role={role}
            environment={environment}
            currentUser={currentUser}
          />
        );
      }
      return (
        <div>
          <LoginDialog open={show} handleLogin={this.handleLogInAction} currentUser={currentUser} />
        </div>
      );
    };
    return <div>{getContent()}</div>;
  }
}

Main.propTypes = {
  environment: PropTypes.string,
  route: PropTypes.number,
  currentUser: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.any,
    img: PropTypes.string
  }).isRequired,
  connectionState: PropTypes.string,
  handleConnectionStateChanged: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired
};
