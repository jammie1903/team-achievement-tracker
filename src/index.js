import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { history } from './services/history-service';
import { Router } from 'react-router';

import theme from './services/theme'
import { MuiThemeProvider } from '@material-ui/core';


ReactDOM.render(
    <Router history={history}>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </Router>, document.getElementById('root'));
registerServiceWorker();
