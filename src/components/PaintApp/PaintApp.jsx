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
import Login  from './Login';
import PaintList from './PaintList';
import { Alert  } from 'react-bootstrap';
// ReSharper restore InconsistentNaming



/**
 * Gets OS Version Type
 * @param {String} version
 */
const getOs = (version) => {
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
// ReSharper disable once InconsistentNaming
class PaintApp extends Component {
  constructor(props) {
    super(props);

    const osName = getOs(navigator.appVersion);

      const currentUser = {
          id: -1,
          name: '',
          imgPath: '',
          img: ''
      };

    this.state = {
      currentUser: currentUser,
      role: '',
      osName: osName,
      showAlert: false
    };
    this.setUser = this.setUser.bind(this);
  }

  setUser(userId, user, role) {
    this.setState({ currentUser: user, role: role, showAlert: true });

    localStorage.setItem('currentUser', JSON.stringify(user));

    setTimeout(() => this.setState({ showAlert: false }), 3000);
  }

  render() {
    const { currentUser, role, osName, showAlert } = this.state;

    if (currentUser.id !== -1) {
      return (
        <div>
          {showAlert && (
            <Alert bsStyle="success">Hello {currentUser.name}</Alert>
          )}
          {!showAlert && (
            <PaintList
              role={role}
              OSName={osName}
              currentUser={currentUser}
              {...this.props}
            />
          )}
        </div>
      );
    } else {
        return <Login setUser={this.setUser} {...this.props}/>;
    }
  }
}

export default PaintApp;
