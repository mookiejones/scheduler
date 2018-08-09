/**
 * PaintApp.
 *
 * Paint Load Application.
 *
 * @since 7-25-2018
 *
 * @class PaintApp
 */

// ReSharper disable InconsistentNaming
import React, { Component } from 'react';
import Login from './Login';
import PaintList from './PaintList';
import { OsOptions } from '../../shared';
import { withAlert } from 'react-alert';
// ReSharper restore InconsistentNaming

/**
 * @class PaintApp
 */
// ReSharper disable once InconsistentNaming
class PaintApp extends Component {
  constructor(props) {
    super(props);
    const osName = OsOptions.getOs(navigator.appVersion);

    const currentUser = {
      id: -1,
      name: '',
      imgPath: '',
      img: ''
    };

    this.state = {
      currentUser: currentUser,
      role: '',
      osName: osName
    };
    this.setUser = this.setUser.bind(this);
  }

  setUser(userId, user, role) {
    this.setState({ currentUser: user, role: role });
  }

  render() {
    const { currentUser, role, osName } = this.state;

    if (currentUser.id !== -1) {
      return (
        <PaintList
          role={role}
          OSName={osName}
          currentUser={currentUser}
          {...this.props}
        />
      );
    } else {
      return <Login setUser={this.setUser} {...this.props} />;
    }
  }
}

export default withAlert(PaintApp);
