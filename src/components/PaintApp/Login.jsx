import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Fetch, options, URLS } from '../../shared';

/**
 * @class Login
 */
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.env = props.env;
    this.state = {
      disabled: false,
      emp: null,
      error: ''
    };
    this.loginUser = this.loginUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }
  updateUser(data) {
    const { setUser } = this.props;
    var userId = this.input.value;

    var role = this.select.value;
    if (this.input) this.input.blur();
    this.setState({ disabled: true });
    setUser(userId, data, role);
  }
  loginUser(e) {
    e.preventDefault();

    var userId = this.input.value;

    // if (env === 'development') {
    //   this.setState({ disabled: true });
    //   this.props.setUser(userId, role);
    // }
    Fetch(URLS.GetEmployee, this.env, options({ EmployeeID: userId }))
      .then(this.updateUser)
      .catch(console.error);
  }

  render() {
    return (
      <div className="login-wrapper" style={{ width: '250px', margin: 'auto' }}>
        <form action="" className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>
          <label htmlFor="inputId" className="sr-only">
            Employee ID
          </label>
          <input
            disabled={this.state.disabled}
            type="text"
            pattern="[0-9]*"
            ref={(i) => (this.input = i)}
            id="inputId"
            className="form-control"
            placeholder="Employee ID"
          />
          <label htmlFor="selectRole" className="sr-only">
            Password
          </label>
          <select
            disabled={this.state.disabled}
            ref={(s) => (this.select = s)}
            id="selectRole"
            className="form-control"
            placeholder="Role">
            <option value="assist">Load Assist</option>
            <option value="stage">Staging</option>
            <option value="load">Load</option>
          </select>
          <br />
          <button
            onClick={this.loginUser}
            className="btn btn-lg btn-primary btn-block"
            type="submit">
            Sign in
          </button>
        </form>
      </div>
    );
  }
}
Login.propTypes = {
  setUser: PropTypes.func.isRequired
};
