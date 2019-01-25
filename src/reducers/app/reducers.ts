import {
  SET_ITEMS,
  SET_FILTER,
  SET_TAB,
  SET_LOADING,
  INIT_DATA,
  SET_NETWORK
} from './types';
import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation } from '../../types';
const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();

export interface AppState {
  filters: TezosFilter;
  network: string;
  blocks: TezosBlock[];
  accounts: TezosAccount[];
  operations: TezosOperation[];
  isLoading: boolean;
  selectedTab: string;
};

const initialState: AppState = {
  filters: emptyFilters,
  network: 'zeronet',
  blocks: [],
  accounts: [],
  operations: [],
  isLoading: false,
  selectedTab: 'blocks'
};

const initDatas = {
  blocks: [],
  accounts: [],
  operations: []
}

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return {...state, filters: action.filters};
    case SET_ITEMS:
      return {...state, [action.category]: action.items};
    case SET_TAB:
      return {...state, selectedTab: action.category};
    case SET_LOADING:
      return {...state, isLoading: action.isLoading};
    case SET_NETWORK:
      return {...state, network: action.network};
    case INIT_DATA:
     return {...state, ...initDatas};
  }
  return state;
};
export default appReducer;
