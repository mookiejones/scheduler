import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl, Checkbox } from 'react-bootstrap';
import update from 'immutability-helper';
const {
  editors: { EditorBase }
} = require('react-data-grid');

export class FormControlEditor extends EditorBase {
  constructor(props, context, refs, updater) {
    super(props, context, refs, updater);

    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    const { handleCommit, type, rowIdx } = this.props;
    debugger;
    const value =
      type === 'checkbox' ? event.target.checked : event.target.value;
    handleCommit(rowIdx, { value: value });
  }

  render() {
    const { value, type } = this.props;
    if (type === 'checkbox')
      return (
        <Checkbox
          checked={value}
          onChange={this.onChange}
          style={{ display: 'inline' }}
        />
      );
    return (
      <FormControl type={type} defaultValue={value} onChange={this.onChange} />
    );
  }
}

FormControlEditor.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
  rowIdx: PropTypes.number,
  handleCommit: PropTypes.func.isRequired,
  column: PropTypes.shape({
    key: PropTypes.string,
    onCellChange: PropTypes.func
  }),
  dependentValues: PropTypes.object
};

export class FormControlFormatter extends Component {
  constructor(props, context, refs, updater) {
    super(props, context, refs, updater);

    this.onChange = this.onChange.bind(this);
  }
  onChange(event) {
    const { handleCommit, type, rules, rowIdx } = this.props;

    const value =
      type === 'checkbox' ? event.target.checked : event.target.value;
    const rule = update(rules[rowIdx], { $merge: { color: value } });
    handleCommit(rowIdx, { rule });
  }
  render() {
    const { value, type } = this.props;

    if (type === 'checkbox')
      return (
        <Checkbox
          checked={value}
          readOnly
          inline
          style={{ display: 'inline' }}
        />
      );
    return (
      <FormControl type={type} defaultValue={value} onChange={this.onChange} />
    );
  }
}

FormControlFormatter.propTypes = {
  type: PropTypes.string,
  value: PropTypes.any,
  handleCommit: PropTypes.func
};
