import { ArronaxAction } from './actions';
import { ArronaxState, DataView } from './types';
import { SET_FILTER, SWITCH_TAB, SET_NETWORK } from './constants';
import { TezosConseilQuery } from 'conseiljs';

const emptyFilters = TezosConseilQuery.getEmptyTezosFilter();

const initialState = {
  filters: emptyFilters,
  dataView: DataView.Blocks,
  network: 'zeronet'
};

export default function applyArronaxAction(
  state: ArronaxState = initialState,
  action: ArronaxAction
): ArronaxState {
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
}
