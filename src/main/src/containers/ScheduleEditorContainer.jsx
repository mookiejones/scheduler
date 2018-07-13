import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { PaintScheduleEditor } from '../components/ScheduleEditor';
import DataService from '../api/DataService';

const { DeleteColorRule, GetColorRules } = DataService;

export default class ScheduleEditorContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { rules: [] };
    this.updateRules = this.updateRules.bind(this);
    // this.handleDeleteRow = this.handleDeleteRow.bind(this);
    // this.handleSaveRow = this.handleSaveRow.bind(this);
    // this.handleAddRow = this.handleAddRow.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { route } = nextProps;
    if (route === 0) return true;
    debugger;
    return false;
  }

  fetchRules() {
    GetColorRules()
      .then(this.updateRules)
      .catch((error) => {
        console.error(error);
        debugger;
      });
  }

  componentDidMount() {
    const { route } = this.props;
    if (route !== 0) return;
    this.fetchRules();
    // Get Data here
  }

  check(key, value, expected) {
    const result = typeof value[key] === expected;
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
      .then((o) => {
        debugger;
      })
      .catch((error) => {
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
    const { classes, ...props } = this.props; // <RuleSettings
    //   {...this.props}
    //   rules={rules}
    //   handleAddRow={this.handleAddRow}
    //   handleDeleteRow={this.handleDeleteRow}
    //   handleSaveRow={this.handleSaveRow}
    // />
    return <PaintScheduleEditor {...props} />;
  }
}
ScheduleEditorContainer.propTypes = {
  route: PropTypes.number.isRequired
};
