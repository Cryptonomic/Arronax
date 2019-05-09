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
  REMOVE_ALL_FILTERS,
  CHANGE_FILTER,
  SET_ROW_COUNT,
  SET_AVAILABLE_VALUES,
  COMPLETE_FULL_LOAD,
  SET_FILTER_COUNT,
} from './types';

import { ConseilQueryBuilder, ConseilQuery } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation, Filter } from '../../types';
import { getLocalAttributes } from '../../utils/attributes';

const emptyFilters: ConseilQuery = ConseilQueryBuilder.blankQuery();
const attributes = getLocalAttributes();

export interface AppState {
  filters: ConseilQuery;
  network: string;
  blocks: TezosBlock[];
  availableValues: object;
  columns: object;
  attributes: object;
  operators: object;
  selectedFilters: object;
  accounts: TezosAccount[];
  operations: TezosOperation[];
  isLoading: boolean;
  selectedEntity: string;
  isFullLoaded: boolean;
  rowCount: number;
  filterCount: object;
  platform: string;
}

const initialState: AppState = {
  filters: emptyFilters,
  platform: 'tezos',
  network: 'alphanet',
  blocks: [],
  attributes: attributes,
  selectedFilters: {
    blocks: [],
    operations: [],
    accounts: [],
  },
  operators: {
    numeric: [
      { name: 'eq', displayName: 'is' },
      { name: 'noteq', displayName: 'is not' },
      { name: 'in', displayName: 'is in' },
      { name: 'between', displayName: 'is between' },
      { name: 'lt', displayName: 'is less than' },
      { name: 'gt', displayName: 'is greater than' },
      { name: 'isnull', displayName: 'is null' },
      { name: 'isnotnull', displayName: 'is not null' },
    ],
    string: [
      { name: 'eq', displayName: 'is' },
      { name: 'noteq', displayName: 'is not' },
      { name: 'in', displayName: 'is in' },
      { name: 'like', displayName: 'is like' },
      { name: 'startsWith', displayName: 'starts with' },
      { name: 'endsWith', displayName: 'ends with' },
      { name: 'isnull', displayName: 'is null' },
      { name: 'isnotnull', displayName: 'is not null' },
    ],
    dateTime: [
      { name: 'eq', displayName: 'is' },
      { name: 'noteq', displayName: 'is not' },
      { name: 'in', displayName: 'is in' },
      { name: 'between', displayName: 'is between' },
      { name: 'before', displayName: 'is before' },
      { name: 'after', displayName: 'is after' },
      { name: 'isnull', displayName: 'is null' },
      { name: 'isnotnull', displayName: 'is not null' },
    ],
    boolean: [{ name: 'eq', displayName: 'is' }],
  },
  columns: {
    blocks: [],
    operations: [],
    accounts: [],
  },
  availableValues: {
    blocks: {},
    operations: {},
    accounts: {},
  },
  accounts: [],
  operations: [],
  isLoading: false,
  selectedEntity: 'blocks',
  isFullLoaded: false,
  rowCount: 50,
  filterCount: {
    blocks: 0,
    operations: 0,
    accounts: 0,
  },
};

const initEntities = {
  blocks: [],
  accounts: [],
  operations: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FILTER:
      return { ...state, filters: action.filters };
    case SET_ITEMS:
      return { ...state, [action.entity]: action.items };
    case SET_COLUMNS: {
      const columns = {...state.columns};
      columns[action.entity] = action.items;
      return { ...state, columns };
    }
    case SET_TAB:
      return { ...state, selectedEntity: action.entity };
    case SET_LOADING:
      return { ...state, isLoading: action.isLoading };
    case SET_NETWORK:
      return { ...state, network: action.network };
    case INIT_DATA:
      return { ...state, ...initialState };
    case SET_ATTRIBUTES: {
      const attributes = { ...state.attributes};
      attributes[action.entity] = action.attributes;
      return { ...state, attributes };
    }
    case ADD_FILTER: {
      const selectedFilters = {...state.selectedFilters};
      let filters = selectedFilters[action.entity];
      const emptyFilter: Filter = {
        name: '',
        operator: '',
        operatorType: '',
        isLowCardinality: false,
        values: ['']
      };
      filters = filters.concat(emptyFilter);
      selectedFilters[action.entity] = filters;
      return { ...state, selectedFilters };
    }
    case REMOVE_FILTER: {
      const selectedFilters = {...state.selectedFilters};
      let filters = selectedFilters[action.entity];
      filters.splice(action.index, 1);
      selectedFilters[action.entity] = [...filters];
      return { ...state, selectedFilters };
    }
    case REMOVE_ALL_FILTERS: {
      const selectedFilters = {...state.selectedFilters};
      selectedFilters[action.entity] = [];
      const selectedEntity = state.selectedEntity;
      const filterCount = {...state.filterCount};
      filterCount[selectedEntity] = 0;
      return { ...state, selectedFilters, filterCount };
    }
    case CHANGE_FILTER: {
      const selectedFilters = {...state.selectedFilters};
      let filters = selectedFilters[action.entity];
      filters[action.index] = action.filter;
      selectedFilters[action.entity] = [...filters];
      return { ...state, selectedFilters };
    }
    case SET_AVAILABLE_VALUES: {
      const availableValues = { ...state.availableValues};
      const entityValues = {...availableValues[action.entity]};
      entityValues[action.attribute] = action.availableValues;
      availableValues[action.entity] = entityValues;
      return { ...state, availableValues };
    }
    case SET_FILTER_COUNT: {
      const selectedEntity = state.selectedEntity;
      const filterCount = state.filterCount;
      filterCount[selectedEntity] = action.count;
      return { ...state, filterCount };
    }
    case SET_ROW_COUNT: {
      return { ...state, rowCount: action.rows };
    }
    case COMPLETE_FULL_LOAD:
      return { ...state, isFullLoaded: action.isFullLoaded };
  }
  return state;
};
export default appReducer;
