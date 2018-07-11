import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import { Save, Delete } from '@material-ui/icons';
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  IconButton,
  TextField,
  Slide,
  Snackbar,
  MenuItem,
  Tooltip
} from '@material-ui/core';

import style from '../../../style';
import ColorRule from '../Rules/ColorRule';

const items = [
  'id',
  'style_code',
  'pieces',
  'assembly_flow',
  'add_take_off',
  'total_crs',
  'program',
  'mold_skin_style',
  'notes',
  'rework_color_chart',
  'color',
  'blank',
  'total_crs_2',
  'total_pcs',
  'customer',
  'round',
  'crs_real_time',
  'date_created',
  'processed_date',
  'mold_wip_density',
  'round_position',
  'active',
  'scheduled_date',
  'finalized',
  'finalized_date',
  'trial_block',
  'loc',
  'abo_1',
  'abo_2',
  'abo_3',
  'abo_4'
];

const TransitionDown = props => <Slide {...props} direction='down' />;

class RuleComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      message: '',
      raised: false,
      value: {
        title: props.rule.Name || '',
        color: props.rule.Color || '#000',
        type: props.rule.Contains || 'contains',
        keyName: props.rule.Element || 'program',
        search: props.rule.Value || ''
      }
    };
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleRuleChanged = this.handleRuleChanged.bind(this);
    this.handleKeyChange = this.handleKeyChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.delete = this.delete.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  saveChanges() {
    this.props.handleSaveItem(this.props.rule);

    this.setState({ show: true, message: 'Saved' });
  }

  delete() {
    const { handleDeleteItem } = this.props;
    handleDeleteItem(this.props.rule);
    this.setState({ show: true, message: 'Deleted' });
  }

  handleValueChange(event, key) {
    const { value } = this.state;
    value[key] = event.target.value;
    this.setState({ value });
  }

  handleColorChange(event) {
    this.setState({ value: { color: event.target.value } });
  }

  handleTitleChange(event) {
    this.setState({ value: { title: event.target.value } });
  }

  // eslint-disable-next-line
  handleRuleChanged() {
    debugger;
  }

  handleKeyChange(event) {
    // eslint-disable-next-line
    this.setState({ 'value.keyname': event.target.value });
  }

  handleSearchChange(event) {
    this.setState({ 'value.search': event.target.value });
  }
  // eslint-disable-next-line
  handleSnackbarClose() {
    debugger;
  }

  render() {
    const {
      classes: {
 margin, textField, card, actions, action, menu
},
      rule: {
 Color, Name, Contains, Value, Element
}
    } = this.props;

    const { show, raised, message } = this.state;
    return (
      <Card
        className={card}
        onMouseLeave={() => {
          if (raised) {
            this.setState({ raised: false });
          }
        }}
        onMouseEnter={() => {
          if (!raised) {
            this.setState({ raised: true });
          }
        }}
        raised={raised}
      >
        <CardContent>
          <Grid container justify='center'>
            <Tooltip
              id='name-tooltip'
              title='The name Component is used for coloring the element. This value must be unique'
            >
              <TextField
                aria-label='Name'
                label='Name'
                fullWidth
                value={Name}
                onChange={e => this.handleValueChange(e, 'Name')}
                className={classNames(margin, textField)}
              />
            </Tooltip>

            <Tooltip id='element-tooltip' title='The Element Component is the value to evaluate'>
              <TextField
                label='Element'
                fullWidth
                value={Element}
                onChange={e => this.handleValueChange(e, 'Element')}
                select
                className={classNames(margin, textField)}
              >
                {items.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Tooltip>

            <Tooltip
              id='rule-tooltip'
              title='The Rule component allows you to select if the element equals or only contains the value'
            >
              <TextField
                id='select-contains'
                label='Rule'
                value={this.state.value}
                fullWidth
                onChange={e => this.handleValueChange(e, 'Contains')}
                SelectProps={{
                  MenuProps: {
                    className: menu
                  }
                }}
                select
              >
                {[{ title: 'Equals', value: false }, { title: 'Contains', value: true }].map(v => (
                  <MenuItem key={v.title} value={v.value}>
                    {v.title}
                  </MenuItem>
                ))}
              </TextField>
            </Tooltip>
            <Tooltip id='rule-value' title='Add the value that you would like to evaluate here.'>
              <TextField
                label='Value'
                fullWidth
                onChange={e => this.handleValueChange(e, 'Value')}
                value={Value}
                className={classNames(margin, textField)}
              />
            </Tooltip>
            <Tooltip
              id='rule-color'
              title='This is the value that the background will be changed to'
            >
              <TextField
                type='color'
                fullWidth
                label='Color'
                value={Color}
                className={classNames(margin, textField)}
                onChange={e => this.handleValueChange(e, 'color')}
              />
            </Tooltip>
          </Grid>
        </CardContent>
        <CardActions disableActionSpacing className={actions}>
          <IconButton aria-label='Save' className={action} onClick={this.saveChanges}>
            <Save />
          </IconButton>
          <IconButton aria-label='Delete' className={action} onClick={this.delete}>
            <Delete />
          </IconButton>
        </CardActions>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          onClose={() => this.setState({ show: false })}
          TransitionComponent={TransitionDown}
          autoHideDuration={1000}
          open={show}
          message={message}
        />
      </Card>
    );
  }
}
RuleComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  handleDeleteItem: PropTypes.func.isRequired,
  handleSaveItem: PropTypes.func.isRequired,

  // eslint-disable-next-line
  rule: PropTypes.oneOfType([
    PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Color: PropTypes.string.isRequired,
      Value: PropTypes.string.isRequired,
      Element: PropTypes.string.isRequired,
      Contains: PropTypes.bool.isRequired
    }),
    PropTypes.instanceOf(ColorRule)
  ])
};

export default withStyles(style)(RuleComponent);
