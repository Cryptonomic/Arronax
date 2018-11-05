import { combineReducers } from 'redux-immutable';
import globalReducer from './containers/App/reducer';

export default function createReducer(injectedReducers: any) {
  return combineReducers({
    global: globalReducer,
    ...injectedReducers
  });
}
