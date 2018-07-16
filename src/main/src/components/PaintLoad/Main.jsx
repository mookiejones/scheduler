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
      connectionState: 'disconnected',
      disabled: false,
      currentUser: {
        id: -1,
        name: ''
      },
      role: ''
    };
    this.loggedIn = this.loggedIn.bind(this);
  }

  loggedIn(args) {
    DataService.LoginUser(args)
      .then(o => o.json())
      .then((o) => {
        this.setState({
          showDialog: false,
          currentUser: {
            name: o,
            id: args.user
          },
          role: args.type
        });
        debugger;
      })
      .catch((error) => {
        debugger;
      });
    // this.setState({ showDialog: false });
  }

  setUser(userId, name, role) {
    debugger;

    this.setState({ currentUser: { id: userId, name }, role });
  }

  shouldComponentUpdate(nextProps) {
    const { route } = nextProps;
    return route === 2;
  }

  render() {
    const { showDialog, currentUser, role } = this.state;
    const { loggedIn, environment, route } = this.props;
    const getContent = () => {
      if (currentUser.id !== -1) {
        return (
          <PaintList
            {...this.props}
            connectionStateChanged={connectionState => this.setState({ connectionState })}
            role={role}
            environment={environment}
            currentUser={currentUser}
          />
        );
      }
      return (
        <div>
          <LoginDialog open={showDialog && route === 2} loggedIn={this.loggedIn} {...this.props} />
        </div>
      );
    };
    return <div>{getContent()}</div>;
  }
}

Main.propTypes = {
  route: PropTypes.number,
  connectionState: PropTypes.any
};
