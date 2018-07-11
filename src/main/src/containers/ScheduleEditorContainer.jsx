import React, { Component } from 'react';
import { RuleSettings } from '../components/ScheduleEditor';
import PropTypes from 'prop-types';
import DataService from '../api/DataService';

const { DeleteColorRule, GetColorRules } = DataService;
const styles = {};

export default class ScheduleEditorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { rules: [] };
    this.updateRules = this.updateRules.bind(this);
    // this.handleDeleteRow = this.handleDeleteRow.bind(this);
    // this.handleSaveRow = this.handleSaveRow.bind(this);
    // this.handleAddRow = this.handleAddRow.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { route } = nextProps;
    if (route == 0) return true;
    debugger;
    return false;
  }

  fetchRules() {
    GetColorRules()
      .then(this.updateRules)
      .catch(error => {
        console.error(error);
        debugger;
      });
  }

  componentDidMount() {
    const { route } = this.props;
    if (route != 0) return;
    this.fetchRules();
    // Get Data here
  }

  check(key, value, expected) {
    const result = typeof value[key] === expected;
    console.log(`Rule.${key} should be a ${expected}: ${result}`);
    if (!result) {
      debugger;
    }
  }

  updateRules(rules) {
    // Check to insure that all data is valid
    for (const rule of rules) {
      this.check('Id', rule, 'string');
      this.check('Contains', rule, 'boolean');
      this.check('Color', rule, 'string');
      this.check('Element', rule, 'string');
      this.check('Name', rule, 'string');
      this.check('Value', rule, 'string');
    }
    this.setState({ rules });
  }

  handleDeleteRow(row) {
    debugger;
    DeleteColorRule(row)
      .then(o => {
        debugger;
      })
      .catch(error => {
        debugger;
      });
  }

  printError(error) {
    console.error(error);
  }

  handleSaveRow(row) {
    DataService.SaveColorRule(row)
      .then(this.updateRules)
      .catch(this.printError);
  }

  handleAddRow(row) {
    debugger;
  }

  render() {
    const { rules } = this.state;
    const { classes, ...props } = this.props;
    return (
      <RuleSettings
        {...this.props}
        rules={rules}
        handleAddRow={this.handleAddRow}
        handleDeleteRow={this.handleDeleteRow}
        handleSaveRow={this.handleSaveRow}
      />
    );
  }
}
ScheduleEditorContainer.propTypes = {
  route: PropTypes.number
  //   classes: PropTypes.object.isRequired
};
