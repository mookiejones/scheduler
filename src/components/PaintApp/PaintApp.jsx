/**
 * PaintApp.
 *
 * Paint Load Application.
 *
 * @since 7-25-2018
 *
 * @class PaintApp
 */

import React, { Component } from 'react';
import Login from './Login';
import PaintList from './PaintList';

/**
 * Gets OS Version Type
 * @param {String} version
 */
const GetOs = (version) => {
  let result = 'Unknown OS';
  if (/Win/.test(version)) return 'Windows';
  if (/Mac/.test(version)) return 'MacOS';
  if (/X11/.test(version)) return 'UNIX';
  if (/Linux/.test(version)) return 'Linux';
  return result;
};

/**
 * @class PaintApp
 */
class PaintApp extends Component {
  constructor(props) {
    super(props);

    const OSName = GetOs(navigator.appVersion);

    this.state = {
      currentUser: {
        id: -1,
        name: '',
        imgPath: '',
        img: ''
      },
      role: '',
      OSName: OSName
    };
    this.setUser = this.setUser.bind(this);
  }

  setUser(userId, user, role) {
    this.setState({ currentUser: user, role: role });
  }

  render() {
    const { currentUser, role, OSName } = this.state;
    if (this.state.currentUser.id !== -1) {
      return (
        <PaintList
          role={role}
          OSName={OSName}
          currentUser={currentUser}
          {...this.props}
        />
      );
    } else {
      return <Login setUser={this.setUser} {...this.props} />;
    }
  }
}

export default PaintApp;
