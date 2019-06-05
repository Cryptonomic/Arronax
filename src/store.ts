import { Store, createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import { RootState, rootReducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

export const store: Store<RootState> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(reduxThunk))
);
