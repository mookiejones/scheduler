import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render( < App / > , document.getElementById( 'root' ) );
if ( /s/i.test( window.location.protocol ) )
    registerServiceWorker();
else
    console.log( 'not starting service worker because we arent secure.' )