import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import DateItem from './DateItem';
import { SlidersIcon } from '../Icons';
import {
  Button,
  Grid,
  Row,
  Checkbox,
  FormGroup,
  Modal,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import { chartOptions } from './DefaultChartOptions';

const isEnabled = (item) => item.enabled;
export default class ChartOptions extends PureComponent {
  state = {
    open: false
  };
  handleChartTypeChange(event) {
    debugger;
  }
  render() {
    const { show } = this.state;
    const {
      to,
      from,
      handleToChange,
      handleFromChange,
      handleOptionsChange,
      options
    } = this.props;
    const isChecked =
      options.legend === undefined ? false : options.legend.enabled;

    return (
      <Fragment>
        <Button
          className="pull-right"
          onClick={() => this.setState({ show: !this.state.show })}>
          <SlidersIcon />
        </Button>
        <Modal show={show} onHide={() => this.setState({ show: false })}>
          <Modal.Header closeButton>
            <Modal.Title>Chart Options</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid fluid style={{ margin: '60px' }}>
              <Row bsClass="row noBorder">
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
                <FormGroup>
                  <Checkbox
                    title="Show Legend"
                    checked={isChecked}
                    onChange={(e) =>
                      handleOptionsChange('legend.enabled', e.target.checked)
                    }>
                    Show Legend
                  </Checkbox>

                  <ControlLabel>Chart Type</ControlLabel>
                  <FormControl
                    componentClass="select"
                    onChange={this.handleChartTypeChange}>
                    {chartOptions.chart.types.filter(isEnabled).map((o) => (
                      <option key={o.name} value={o.name}>
                        {o.name}
                      </option>
                    ))}
                  </FormControl>
                </FormGroup>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ show: false })}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

ChartOptions.propTypes = {
  handleToChange: PropTypes.func.isRequired,
  handleFromChange: PropTypes.func.isRequired,
  to: PropTypes.object.isRequired,
  from: PropTypes.object.isRequired,
  handleOptionsChange: PropTypes.func.isRequired,
  options: PropTypes.any.isRequired
};
