import { combineReducers } from 'redux';
import { message } from './message/reducers';
import { app } from './app/reducers';

export interface RootState {
  app: any;
  message: any;
};


export const rootReducer = combineReducers({
  app,
  message
});
