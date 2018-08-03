import React from 'react';

import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
const styles = {
  root: { display: 'flex' },
  bottom: { marginBottom: '10px', marginTop: '10px' },
  date: { marginLeft: '25px' }
};
/*
showTimeSelect
timeCaption="Time"
style={styles.date}
dateFormat="LLL"
onChange={onChange}
forceValidDate={true}
updateOnDateClick={true}
collapseOnDateClick={false}
selected={value}*/
const DateItem = ({ value, label, handleChange }) => (
  <div className="layers bd bgc-white p-20" style={styles.bottom}>
    <label>
      {label}
      <DatePicker
        placeholderText="Click to select a date"
        todayButton="Today"
        allowSameDate={true}
        showTimeSelect
        timeCaption="Time"
        style={styles.date}
        dateFormat="LLL"
        selected={value}
        onSelect={(value, event) => {
          handleChange(value, event);
        }}
      />
    </label>
  </div>
);

DateItem.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string,
  handleChange: PropTypes.func.isRequired
};

export default DateItem;
