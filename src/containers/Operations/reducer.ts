import { fromJS } from 'immutable';
import { OperationsStateMap } from 'types';
import { OperationsAction } from './actions';
import {FETCH_OPERATIONS, FETCH_OPERATIONS_FAILED, SET_OPERATIONS} from './constants';

export const initialState: OperationsStateMap = fromJS({
  items: [],
  fetching: false,
  error: ''
});

export default (
  state: OperationsStateMap = initialState,
  action: OperationsAction
): OperationsStateMap => {
  switch (action.type) {
    case FETCH_OPERATIONS:
      return state.set('fetching', true).set('error', '');
    case SET_OPERATIONS:
      return state.set('items', fromJS(action.operations)).set('fetching', false);
    case FETCH_OPERATIONS_FAILED:
      return state.set('fetching', false).set('error', action.error);
    default:
      return state;
  }
};
