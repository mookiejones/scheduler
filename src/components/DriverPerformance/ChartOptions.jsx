import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DateItem from './DateItem';
import { Grid, Row, Col, Checkbox } from 'react-bootstrap';
export default class ChartOptions extends Component {
  render() {
    const {
      to,
      from,
      handleToChange,
      handleFromChange,
      handleOptionsChange
    } = this.props;
    return (
      <Grid fluid style={{ margin: '60px' }}>
        <Row bsClass="row noBorder">
          <Col style={{ marginRight: '15px' }}>
            <DateItem
              label="Start Date:"
              highlightDates={[from]}
              handleChange={handleToChange}
              value={from}
              {...this.props}
            />
          </Col>
          <Col style={{ marginRight: '15px' }}>
            <DateItem
              label="End Date:"
              highlightDates={[to]}
              handleChange={handleFromChange}
              value={to}
              {...this.props}
            />
          </Col>

          <Col>
            <div
              className="layers bd bgc-white p-20"
              style={{ marginBottom: '10px', marginTop: '10px' }}>
              <Checkbox
                onChange={(e) =>
                  handleOptionsChange('legend.enabled', e.target.checked)
                }>
                Show Legend
              </Checkbox>
            </div>
          </Col>
        </Row>
      </Grid>
    );
  }
}

ChartOptions.propTypes = {
  handleToChange: PropTypes.func.isRequired,
  handleFromChange: PropTypes.func.isRequired,
  to: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired,
  handleOptionsChange: PropTypes.func.isRequired
};
