import React, {
  Component
} from 'react';
import Main from "./components/Main";
import './App.css';
import './css/bootstrap.css';
import './css/default.css';
// // import './css/font-awesome.min.css';
import './css/navigation.css';
import './css/react-bootstrap-table-all.min.css';
import './css/react-context-menu.css';
import './css/react-data-grid.css';
import './css/style.css';

import ErrorBoundry from './components/ErrorBoundry';
class App extends Component {



  render() {
    return ( <
      ErrorBoundry >
      <
      Main / >
      <
      /ErrorBoundry>);
    }
  }

  export default App;