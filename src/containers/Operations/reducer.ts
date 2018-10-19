import { fromJS } from 'immutable';
import { OperationsStateMap } from 'types';
import { OperationsAction } from './actions';
import { FETCH_OPERATIONS, SET_OPERATIONS } from './constants';

export const initialState: OperationsStateMap = fromJS({
  items: [],
  fetching: false
});

export default (
  state: OperationsStateMap = initialState,
  action: OperationsAction
): OperationsStateMap => {
  switch (action.type) {
    case FETCH_OPERATIONS:
      return state.set('fetching', true);
    case SET_OPERATIONS:
      return state
        .set('items', fromJS(action.operations))
        .set('fetching', false);
    default:
      return state;
  }
};
