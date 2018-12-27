import { fromJS } from 'immutable';
import { BlocksStateMap } from 'types';
import { BlocksAction } from './actions';
import {SET_BLOCKS, FETCH_BLOCKS, FETCH_BLOCKS_FAILED} from './constants';

export const initialState: BlocksStateMap = fromJS({
  items: [],
  fetching: false,
  error: ''
});

export default (
  state: BlocksStateMap = initialState,
  action: BlocksAction
): BlocksStateMap => {
  switch (action.type) {
    case FETCH_BLOCKS:
      return state.set('fetching', true).set('error', '');
    case SET_BLOCKS:
      return state.set('items', fromJS(action.blocks)).set('fetching', false);
    case FETCH_BLOCKS_FAILED:
        return state.set('fetching', false).set('error', action.error);
    default:
      return state;
  }
};
