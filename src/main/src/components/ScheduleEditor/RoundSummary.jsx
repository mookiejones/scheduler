import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
 Grid, Toolbar, Badge, IconButton, TextField
} from '@material-ui/core';
import { Settings } from '@material-ui/icons';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  }
});
const badges = [
  { name: 'Round', content: 'round', color: 'default' },
  { name: 'Build Count', content: 'build_count', color: 'success' },
  {
    name: 'Carrier Removal',
    content: 'carrier_removal',
    color: 'secondary'
  },
  { name: 'Tray Counter', content: 'tray_counter', color: 'primary' }
];
class RoundSummary extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.state = {
      searchText: '',
      roundSummary: props.roundSummary,
      round: props.round
    };
  }

  handleSearchChange(e) {
    const { handleChange } = this.props;
    this.setState({ searchText: e.target.value });
    handleChange(e);
  }

  render() {
    const { searchText } = this.state;
    const {
 round, roundSummary, onClick, classes
} = this.props;
    if (round > 0) {
      return (
        <Toolbar>
          <Grid container justify='space-around'>
            {badges.map(badge => (
              <Grid item xs={1} key={badge.content}>
                <Badge
                  color='secondary'
                  className={classes.padding}
                  badgeContent={roundSummary[round][badge.content]}
                >
                  {badge.name}
                </Badge>
              </Grid>
            ))}

            <Grid item xs='auto'>
              <IconButton onClick={onClick}>
                <Settings />
              </IconButton>
            </Grid>
            <Grid item xs='auto'>
              <TextField
                label='search'
                fullWidth
                value={searchText}
                onChange={this.handleSearchChange}
              />
            </Grid>
          </Grid>
        </Toolbar>
      );
    }
    return (
      <div
        style={{
          width: '100%',
          height: '50px',
          backgroundColor: 'rgb(249, 249, 249)',
          margin: 'auto'
        }}
      />
    );
  }
}

RoundSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  handleChange: PropTypes.func,
  round: PropTypes.string,
  roundSummary: PropTypes.any,
  onClick: PropTypes.func
};
export default withStyles(styles)(RoundSummary);
