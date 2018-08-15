import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { history } from './services/history-service';
import { Router } from 'react-router';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#7c43bd',
            main: '#4a148c',
            dark: '#12005e',
            contrastText: '#fff',
        },
        secondary: {
            light: '#cfff95',
            main: '#9ccc65',
            dark: '#6b9b37',
            contrastText: '#000000',
        },
    },
});

ReactDOM.render(
    <Router history={history}>
        <MuiThemeProvider theme={theme}>
            <App />
        </MuiThemeProvider>
    </Router>, document.getElementById('root'));
registerServiceWorker();
