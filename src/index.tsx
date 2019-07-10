import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import Arronax from './containers/App';
import Loader from './components/Loader';
import { Provider } from 'react-redux';
import { store } from './store';
import * as serviceWorker from './serviceWorker';
import './utils/i18n';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Arronax />
    </Suspense>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
