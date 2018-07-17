import React, { Component } from 'react';
import * as classnames from 'classnames';
import PropTypes from 'prop-types';
import { SvgIcon, IconButton, TextField } from '@material-ui/core';
import { CalculatorIcon } from '../Icons';

export default class Calculator extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false
    };
  }

  calcClick() {
    const { editing } = this.state;
    const { currentUser, rowData, updatePartialQty } = this.props;
    if (editing) {
      const newQty = this.input.value;

      if (rowData.picked_by === currentUser.name) {
        if (parseInt(newQty, 10) < rowData[9]) {
          updatePartialQty(parseInt(newQty, 10), rowData);
        } else {
          // var el = document.getElementById("alert")
          // $(el).fadeIn(1000);
          // setTimeout(function () {
          //    $(el).fadeOut();
          // }, 8000);
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
    const { editing } = this.state;
    if (/(?:load|watch)/.test(role)) {
      if (rowData.picked_by !== '##AVAILABLE##') {
        if (rowData.handled_by !== '##AVAILABLE##') {
          return (
            <SvgIcon>
              <path data='M19,19H5V5H15V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V11H19M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z' />
            </SvgIcon>
          );
        }
        return (
          <SvgIcon>
            <path data='M6,4V11H4C2.89,11 2,11.89 2,13V17A3,3 0 0,0 5,20A3,3 0 0,0 8,17H10A3,3 0 0,0 13,20A3,3 0 0,0 16,17V13L12,4H6M17,5V19H22V17.5H18.5V5H17M7.5,5.5H11.2L14.5,13H7.5V5.5M5,15.5A1.5,1.5 0 0,1 6.5,17A1.5,1.5 0 0,1 5,18.5A1.5,1.5 0 0,1 3.5,17A1.5,1.5 0 0,1 5,15.5M13,15.5A1.5,1.5 0 0,1 14.5,17A1.5,1.5 0 0,1 13,18.5A1.5,1.5 0 0,1 11.5,17A1.5,1.5 0 0,1 13,15.5Z' />
          </SvgIcon>
        );
      }
      return <div />;
    }
    const inputStyle = classnames({
      hidden: !editing
    });

    if (rowData.picked_by === currentUser.name) {
      return (
        <div className='action'>
          <TextField
            type='tel'
            ref={i => (this.input = i)}
            className={inputStyle}
            name='quantity'
            style={{ width: '65px' }}
          />
          <IconButton onClick={this.calcClick}>
            <CalculatorIcon {...this.props} />
          </IconButton>
        </div>
      );
    }
    return <div className='tap' />;
  }
}

Calculator.propTypes = {
  currentUser: PropTypes.any,
  role: PropTypes.string,
  rowData: PropTypes.any,
  updatePartialQty: PropTypes.func
};
