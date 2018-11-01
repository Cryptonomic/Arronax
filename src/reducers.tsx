import { ArronaxAction } from 'actions';
import { ArronaxState } from 'types';
import { SET_FILTER, SET_NETWORK } from './constants';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';

const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();

export const initialState: ArronaxState = {
  filters: emptyFilters,
  network: 'zeronet'
};

export default (
  state: ArronaxState = initialState,
  action: ArronaxAction
): ArronaxState => {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, filters: action.filters };
    case SET_NETWORK:
      return { ...state, network: action.network };
    default:
      return state;
  }
};
