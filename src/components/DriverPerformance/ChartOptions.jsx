import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateItem from './DateItem';

export default class ChartOptions extends Component {
  render() {
    const { to, from, handleToChange, handleFromChange } = this.props;
    return (
      <div className="driver-options well">
        <DateItem
          label="Start Date:"
          highlightDates={[from]}
          handleChange={handleToChange}
          value={from}
          {...this.props}
        />
        <DateItem
          label="End Date:"
          highlightDates={[to]}
          handleChange={handleFromChange}
          value={to}
          {...this.props}
        />
      </div>
    );
  }
}

ChartOptions.propTypes = {
  handleToChange: PropTypes.func.isRequired,
  handleFromChange: PropTypes.func.isRequired,
  to: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired
};
