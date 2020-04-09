import { combineReducers } from 'redux';
import { message } from './message/reducers';
import { app } from './app/reducers';
import { modal } from './modal/reducers';

export interface RootState {
    app: any;
    message: any;
    modal: any;
}

export const rootReducer = combineReducers({
    app,
    message,
    modal,
});
