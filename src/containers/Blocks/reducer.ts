import { fromJS } from 'immutable';
import { BlocksStateMap } from 'types';
import { BlocksAction } from './actions';
import { SET_BLOCKS, FETCH_BLOCKS } from './constants';

export const initialState: BlocksStateMap = fromJS({
  items: [],
  fetching: false
});

export default (
  state: BlocksStateMap = initialState,
  action: BlocksAction
): BlocksStateMap => {
  switch (action.type) {
    case FETCH_BLOCKS:
      return state.set('fetching', true);
    case SET_BLOCKS:
      return state.set('items', fromJS(action.blocks)).set('fetching', false);
    default:
      return state;
  }
};
