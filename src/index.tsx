import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Arronax from './containers/App';
import Loader from './components/Loader';
import { Provider } from 'react-redux';
import { store } from './store';
import * as serviceWorker from './serviceWorker';
import './utils/i18n';

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <DndProvider backend={HTML5Backend}>
        <Arronax />
			</DndProvider>
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
