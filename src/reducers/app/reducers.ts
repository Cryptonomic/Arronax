import { SET_ITEMS, SET_FILTER, SET_TAB, SET_LOADING } from './types';
import { TezosConseilQuery, TezosFilter } from 'conseiljs/dist/conseiljs.web';
import { TezosAccount, TezosBlock, TezosOperation } from '../../types';
const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();
// const emptyFilters = {};

// export interface AppState {
//   filters: TezosFilter;
//   network: string;
//   blocks: TezosBlock[];
//   accounts: TezosAccount[];
//   operations: TezosOperation[];
// };

export interface AppState {
  filters: any;
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

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return {...state, filters: action.filter};
    case SET_ITEMS:
      return {...state, [action.category]: action.items};
    case SET_TAB:
      return {...state, selectedTab: action.category};
    case SET_LOADING:
      return {...state, isLoading: action.isLoading};
  }

  return state;
};
export default appReducer;
