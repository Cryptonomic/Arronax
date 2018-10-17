import { fromJS } from 'immutable';
import { TezosConseilQuery } from 'conseiljs';
import { ArronaxAction } from './actions';
import { ArronaxImmutableState, DataView } from './types';
import { SET_FILTER, SWITCH_TAB, SET_NETWORK } from './constants';

const emptyFilters = TezosConseilQuery.getEmptyTezosFilter();

const initialState = fromJS({
  filters: emptyFilters,
  dataView: DataView.Blocks,
  network: 'zeronet'
});

export default (
  state: ArronaxImmutableState = initialState,
  action: ArronaxAction
): ArronaxImmutableState => {
  switch (action.type) {
    case SET_FILTER:
      return state.set('filters', fromJS(action.filters));
    case SWITCH_TAB:
      return state.set('dataView', fromJS(action.dataView));
    case SET_NETWORK:
      return state.set('network', fromJS(action.network));
    default:
      return state;
  }
};
