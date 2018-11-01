import { fromJS } from 'immutable';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { ArronaxStateMap } from 'types';
import { ArronaxAction } from './actions';
import { SET_FILTER, SET_NETWORK } from './constants';

const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();

export const initialState: ArronaxStateMap = fromJS({
  filters: emptyFilters,
  network: 'zeronet'
});

export default (
  state: ArronaxStateMap = initialState,
  action: ArronaxAction
): ArronaxStateMap => {
  switch (action.type) {
    case SET_FILTER:
      return state.set('filters', fromJS(action.filters));
    case SET_NETWORK:
      return state.set('network', fromJS(action.network));
    default:
      return state;
  }
};
