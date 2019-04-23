import { Store, createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducers, { RootState } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export const store: Store<RootState> = createStore(
  rootReducers,
  composeWithDevTools(applyMiddleware(reduxThunk))
);
