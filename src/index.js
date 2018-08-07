import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.min.css';

import { Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import './Extensions';
import MainApp from './components/MainApp';

const options = {
  timeout: 5000,
  position: 'bottom center'
};
const App = () => (
  <Provider template={AlertTemplate} {...options}>
    <MainApp />
  </Provider>
);
ReactDOM.render(<App />, document.getElementById('container'));
