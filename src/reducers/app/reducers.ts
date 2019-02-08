import {
  SET_ITEMS,
  SET_FILTER,
  SET_TAB,
  SET_LOADING,
  INIT_DATA,
  SET_NETWORK,
  SET_COLUMNS,
} from './types';

import { TezosConseilQuery, TezosFilter } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation } from '../../types';
const emptyFilters: TezosFilter = TezosConseilQuery.getEmptyTezosFilter();

export interface AppState {
  filters: TezosFilter;
  network: string;
  blocks: TezosBlock[];
  columns: Array<object>;
  accounts: TezosAccount[];
  operations: TezosOperation[];
  isLoading: boolean;
  selectedTab: string;
}

const initialState: AppState = {
  filters: emptyFilters,
  network: 'zeronet',
  blocks: [],
  columns: [
    { title: 'Level', dataIndex: 'level', key: 'level' },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    { title: 'Block Hash', dataIndex: 'hash', key: 'blockHash' },
    {
      title: 'Predecessor Hash',
      dataIndex: 'predecessor',
      key: 'predecessor',
    },
    {
      title: 'Operations Hash',
      dataIndex: 'operationsHash',
      key: 'operationsHash',
    },
    {
      title: 'Protocol Hash',
      dataIndex: 'protocol',
      key: 'protocol',
    },
  ],
  accounts: [],
  operations: [],
  isLoading: false,
  selectedTab: 'blocks',
};

const initDatas = {
  blocks: [],
  accounts: [],
  operations: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, filters: action.filters };
    case SET_ITEMS:
      return { ...state, [action.category]: action.items };
    case SET_COLUMNS:
      return { ...state, columns: action.items };
    case SET_TAB:
      return { ...state, selectedTab: action.category };
    case SET_LOADING:
      return { ...state, isLoading: action.isLoading };
    case SET_NETWORK:
      return { ...state, network: action.network };
    case INIT_DATA:
      return { ...state, ...initDatas };
  }
  return state;
};
export default appReducer;
