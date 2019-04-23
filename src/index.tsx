import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, HashRouter as Router } from 'react-router-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import { store } from './store';
import '!file-loader?name=[name].[ext]!./assets/favicon.ico';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Route component={App} />
    </Router>
  </Provider>
  ,document.getElementById('root')
);