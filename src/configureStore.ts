import { createStore, applyMiddleware, compose } from 'redux';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState: any = {}) {
  const middlewares = [sagaMiddleware];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          shouldHotReload: false
        })
      : compose;

  const store = createStore(
    createReducer({}),
    fromJS(initialState),
    composeEnhancers(...enhancers)
  );

  // Extensions
  (store as any).runSaga = sagaMiddleware.run;
  (store as any).injectedReducers = {}; // Reducer registry
  (store as any).injectedSagas = {}; // Saga registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  if ((module as any).hot) {
    (module as any).hot.accept('./reducers', () => {
      store.replaceReducer(createReducer((store as any).injectedReducers));
    });
  }

  return store;
}
