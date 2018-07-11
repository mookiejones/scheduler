import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import * as PropTypes from 'prop-types';
import { Add } from '@material-ui/icons';
import { Button, Grid, List } from '@material-ui/core';
import RuleComponent from './RuleComponent';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  }
});

class RuleSettings extends Component {
  constructor(props) {
    super(props);
    this.onValueChanged = this.onValueChanged.bind(this);
    // this.onAddItem = this.onAddItem.bind(this);
  }

  onValueChanged() {
    debugger;
  }

  render() {
    const {
 classes, rules, handleDeleteRow, handleAddRow, handleSaveRow
} = this.props;
    return (
      <Grid>
        <List>
          {rules.map(rule => (
            <RuleComponent
              handleAddItem={handleAddRow}
              handleDeleteItem={handleDeleteRow}
              handleSaveItem={handleSaveRow}
              key={rule.Name}
              rule={rule}
            />
          ))}
        </List>
        <Button
          variant='fab'
          color='secondary'
          aria-label='Add'
          className={classes.fab}
          onClick={handleAddRow}
        >
          <Add />
        </Button>
      </Grid>
    );
  }
}

RuleSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  handleAddRow: PropTypes.func.isRequired,
  handleDeleteRow: PropTypes.func.isRequired,
  handleSaveRow: PropTypes.func.isRequired,
  rules: PropTypes.arrayOf(
    PropTypes.shape({
      Name: PropTypes.string,
      Color: PropTypes.string,
      Value: PropTypes.string,
      Contains: PropTypes.bool,
      Element: PropTypes.string
    })
  )
};

export default withStyles(styles)(RuleSettings);
