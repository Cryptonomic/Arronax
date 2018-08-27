import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Arronax from './containers';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Arronax />
  </Provider>,
  document.getElementById('root')
);
