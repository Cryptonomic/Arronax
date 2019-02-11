import {
  SET_ITEMS,
  SET_FILTER,
  SET_TAB,
  SET_LOADING,
  INIT_DATA,
  SET_NETWORK,
  SET_COLUMNS,
  SET_ATTRIBUTES,
  ADD_FILTER,
  REMOVE_FILTER,
  CHANGE_FILTER
} from './types';

import { ConseilQueryBuilder, ConseilQuery } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation } from '../../types';
const emptyFilters: ConseilQuery = ConseilQueryBuilder.blankQuery();

export interface AppState {
  filters: ConseilQuery;
  network: string;
  blocks: TezosBlock[];
  columns: Array<object>;
  attributes: object;
  operators: object[];
  selectetFilters: object;
  accounts: TezosAccount[];
  operations: TezosOperation[];
  isLoading: boolean;
  selectedTab: string;
}

const initialState: AppState = {
  filters: emptyFilters,
  network: 'alphanet',
  blocks: [],
  attributes: {
    blocks: [],
    operations: [],
    accounts: []
  },
  selectetFilters: {
    blocks: [],
    operations: [],
    accounts: []
  },
  operators: [
    {name: 'BETWEEN', displayName: 'between'},
    {name: 'EQ', displayName: 'equal'},
    {name: 'IN', displayName: 'in'},
    {name: 'LIKE', displayName: 'like'},
    {name: 'LT', displayName: 'less than'},
    {name: 'BEFORE', displayName: 'before'},
    {name: 'GT', displayName: 'greater than'},
    {name: 'AFTER', displayName: 'after'},
    {name: 'STARTSWITH', displayName: 'starts with'},
    {name: 'ENDSWITH', displayName: 'ends With'},
    {name: 'ISNULL', displayName: 'is null'}
  ],
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
    case SET_ATTRIBUTES: {
      const attributes = state.attributes;
      attributes[action.category] = action.attributes;
      return { ...state, attributes };
    }
    case ADD_FILTER: {
      const selectetFilters = state.selectetFilters;
      let filters = selectetFilters[action.category];
      const emptyFilter = {
        name: '',
        operator: ''
      };
      filters = filters.concat(emptyFilter);
      selectetFilters[action.category] = filters;
      return { ...state, selectetFilters };
    }
    case REMOVE_FILTER: {
      const selectetFilters = state.selectetFilters;
      let filters = selectetFilters[action.category];
      filters.splice(action.index, 1);
      selectetFilters[action.category] = [...filters];
      return { ...state, selectetFilters };
    }
    case CHANGE_FILTER: {
      const selectetFilters = state.selectetFilters;
      let filters = selectetFilters[action.category];
      filters[action.index] = action.filter;
      selectetFilters[action.category] = [...filters];
      return { ...state, selectetFilters };
    }
  }
  return state;
};
export default appReducer;
