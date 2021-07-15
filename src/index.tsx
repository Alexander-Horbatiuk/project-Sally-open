import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';

import './index.css';
import App from './App';
import ReduxProvider from "./Redux";
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
    <ReduxProvider>
        <Router>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </Router>
    </ReduxProvider>,
    document.getElementById('root')
);

reportWebVitals();
