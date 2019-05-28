import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import App from './containers/App';
import { Provider } from 'react-redux';
import { store } from './store';
import '!file-loader?name=[name].[ext]!./assets/favicon.ico';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>
  ,document.getElementById('root')
);