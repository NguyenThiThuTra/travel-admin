import { CustomRouter } from 'app/BrowserRouter';
import { history } from 'app/history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { store } from './app/store';
import './index.css';
import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <CustomRouter history={history}> */}
      <Router>
        <App />
      </Router>
      {/* </CustomRouter> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
