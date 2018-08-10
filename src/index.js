import React from 'react';
import { render } from 'react-dom';

/** Redux items */
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './reducers';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import 'font-awesome/css/font-awesome.min.css';

import { Provider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import './Extensions';

import { MainApp } from './components';

import './css/style.css';
/** Options for React-Alert
 *
 * offset:string - The margin of each alert
 * position:[
 * top left,
 * top right,
 * top center
 * bottom left
 * bottom right
 * bottom center
 * ]
 *
 * timeout:number - timout to alert removitself, if set to 0 it never goes away
 * type:[info,success,error]
 * transition:[fade,scale]
 * zIndex:number
 * template
 * */
const options = {
  timeout: 1000,
  position: 'bottom center'
};

const store = createStore(rootReducer);
const App = () => (
  <ReduxProvider store={store}>
    <Provider template={AlertTemplate} {...options}>
      <MainApp />
    </Provider>
  </ReduxProvider>
);
render(<App />, document.getElementById('container'));
