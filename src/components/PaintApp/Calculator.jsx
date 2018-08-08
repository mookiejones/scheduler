import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { CheckIcon, TruckIcon } from '../Icons';

import {
  AVAILABLE,
  WATCH,
  LOAD,
  UserPropType,
  RowPropType
} from '../../shared';

export default class Calculator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  calcClick() {
    const { rowData, currentUser, updatePartialQty } = this.props;
    const { editing } = this.state;
    if (editing) {
      var newQty = this.input.value;

      if (rowData.staged_by === currentUser.name) {
        if (parseInt(newQty, 10) < rowData[9]) {
          updatePartialQty(parseInt(newQty, 10), rowData);
        } else {
          //var el = document.getElementById("alert")
          //$(el).fadeIn(1000);
          //setTimeout(function () {
          //    $(el).fadeOut();
          //}, 8000);
        }
      }

      this.input.value = '';
      this.setState({
        editing: !editing
      });
    } else {
      this.setState({
        editing: !editing
      });
      this.input.focus();
    }
  }
  render() {
    const { role, rowData, currentUser } = this.props;

    if (role === LOAD || role === WATCH) {
      if (rowData.staged_by !== AVAILABLE) {
        if (rowData.handled_by !== AVAILABLE) {
          return (
            <td>
              <CheckIcon />
            </td>
          );
        } else {
          return (
            <td>
              <TruckIcon />
              <i
                style={{ fontSize: '50px' }}
                className="fa fa-truck animate-flicker"
                id=""
              />
            </td>
          );
        }
      } else {
        return <td />;
      }
      // eslint-disable-next-line
      return (
        <td className="tap">
          <i
            style={{ fontSize: '50px' }}
            className="fa fa-truck animate-flicker"
            id=""
          />
        </td>
      );
    } else {
      var inputStyle = classnames({
        hidden: !this.state.editing
      });

      if (rowData.staged_by === currentUser.name) {
        return (
          <td className="action">
            <input
              type="tel"
              ref={(i) => (this.input = i)}
              className={inputStyle}
              name="quantity"
              style={{ width: '65px' }}
            />
            <i
              style={{ fontSize: '50px' }}
              className="fa fa-calculator"
              onClick={this.calcClick}
            />
          </td>
        );
      } else {
        return <td className="tap" />;
      }
    }
  }
}
Calculator.propTypes = {
  updatePartialQty: PropTypes.func,
  role: PropTypes.string,
  rowData: RowPropType.isRequired,
  currentUser: UserPropType.isRequired
};
