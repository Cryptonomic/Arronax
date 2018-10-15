import * as React from 'react';
import * as ReactDOM from 'react-dom';
import applyArronaxAction from 'reducers';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from 'App';
import store from 'store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
