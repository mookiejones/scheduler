const style = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  action: {
    marginLeft: 'auto'
  },
  card: {
    // maxWidth: 400,
    margin: '10px',
    display: 'block',
    transitionDuration: '0.3s'
  },
  menu: {
    width: 200
  },
  actions: {
    display: 'flex',
    float: 'right'
  },
  margin: {
    margin: theme.spacing.unit * 2
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  }
});

export default style;
