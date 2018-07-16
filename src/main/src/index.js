import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import ScheduleEditorContainer from './containers/ScheduleEditorContainer';


const environment = /localhost/gi.test(window.location.origin) ? 'Test' : 'Production';
ReactDOM.render(<App environment ={
      environment
    }
/>, document.getElementById('root'));

    registerServiceWorker();
