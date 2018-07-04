import React, {
  Component
} from 'react';
import logo from './logo.svg';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import DriverChart from './DriverChart'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Snackbar from '@material-ui/core/Snackbar';
import Drawer from '@material-ui/core/Drawer';
const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class App extends Component {
  render() {
    const message="hello";
    return ( 
    <div className={styles.root} >
      <AppBar position = "static" >
      <Toolbar >
      <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
      <MenuIcon / >
      </IconButton> 
      <span>Driver Performance</span>
      </Toolbar > 
      </AppBar>
      <Grid>
        <DriverChart/>
      <Snackbar>
        <SnackbarContent  message={
        <span id="client-snackbar" >
          <Icon />
          {message}
        </span>
      }/>
      </Snackbar>
      </Grid>
      </div>
    );
  }
}

export default App;