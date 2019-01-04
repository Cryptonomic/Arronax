import { Store, createStore, compose, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import rootReducers, {RootState} from './reducers';

export const store: Store<RootState> = createStore(
  rootReducers,
  compose(
    applyMiddleware(reduxThunk),
  )
);
