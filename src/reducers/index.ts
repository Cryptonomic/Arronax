import { combineReducers } from 'redux';
// import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation } from '../types';
import message from './message/reducers';
import app from './app/reducers';

export interface RootState {
  app: any;
  message: any;
};


const rootReducer = combineReducers({
  app,
  message: message
});
export default rootReducer;
