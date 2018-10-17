import { fromJS } from 'immutable';
import { TezosConseilQuery } from 'conseiljs';
import { ArronaxAction } from './actions';
import { ArronaxImmutableState } from './types';
import { SET_FILTER, SET_NETWORK } from './constants';

const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();

const initialState = fromJS({
  filters: emptyFilters,
  network: 'zeronet'
});

export default (
  state: ArronaxImmutableState = initialState,
  action: ArronaxAction
): ArronaxImmutableState => {
  switch (action.type) {
    case SET_FILTER:
      return state.set('filters', fromJS(action.filters));
    case SET_NETWORK:
      return state.set('network', fromJS(action.network));
    default:
      return state;
  }
};
