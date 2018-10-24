import { ArronaxAction } from 'actions';
import { ArronaxState, DataView } from 'types';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { SET_FILTER, SWITCH_TAB, SET_NETWORK } from './constants';

const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();

const initialState: ArronaxState = {
  filters: emptyFilters,
  dataView: DataView.Blocks,
  network: 'zeronet'
};

export default (
  state: ArronaxState = initialState,
  action: ArronaxAction
): ArronaxState => {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, filters: action.filters };
    case SWITCH_TAB:
      return { ...state, dataView: action.dataView };
    case SET_NETWORK:
      return { ...state, network: action.network };
    default:
      return state;
  }
};
