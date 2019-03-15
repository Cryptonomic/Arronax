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
  SET_ROWS,
  SET_VALUES,
  SET_VALUE,
  REMOVE_VALUE,
} from './types';

import { ConseilQueryBuilder, ConseilQuery } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation } from '../../types';

const emptyFilters: ConseilQuery = ConseilQueryBuilder.blankQuery();

export interface AppState {
  filters: ConseilQuery;
  network: string;
  blocks: TezosBlock[];
  values: Array<string>;
  columns: object;
  attributes: object;
  operators: object[];
  selectedFilters: object;
  accounts: TezosAccount[];
  operations: TezosOperation[];
  isLoading: boolean;
  selectedEntity: string;
  selectedValue: Array<object>;
  rowCount: number;
}

const initialState: AppState = {
  filters: emptyFilters,
  network: 'alphanet',
  blocks: [],
  attributes: {
    blocks: [],
    operations: [],
    accounts: [],
  },
  selectedFilters: {
    blocks: [],
    operations: [],
    accounts: [],
  },
  operators: [
    { name: 'BETWEEN', displayName: 'between' },
    { name: 'EQ', displayName: 'equals' },
    { name: 'IN', displayName: 'in' },
    { name: 'LIKE', displayName: 'like' },
    { name: 'LT', displayName: 'less than' },
    { name: 'BEFORE', displayName: 'before' },
    { name: 'GT', displayName: 'greater than' },
    { name: 'AFTER', displayName: 'after' },
    { name: 'STARTSWITH', displayName: 'starts with' },
    { name: 'ENDSWITH', displayName: 'ends With' },
    { name: 'ISNULL', displayName: 'is null' },
  ],
  columns: {
    blocks: [],
    operations: [],
    accounts: [],
  },
  values: [],
  accounts: [],
  operations: [],
  isLoading: false,
  selectedEntity: 'blocks',
  selectedValue: [],
  rowCount: 10,
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
      const columns = state.columns;
      const newColumns = { ...columns };
      newColumns[action.entity] = action.items;
      return { ...state, columns: newColumns };
    }
    case SET_TAB:
      return { ...state, selectedEntity: action.entity };
    case SET_LOADING:
      return { ...state, isLoading: action.isLoading };
    case SET_NETWORK:
      return { ...state, network: action.network };
    case INIT_DATA:
      return { ...state, ...initEntities };
    case SET_ATTRIBUTES: {
      const attributes = state.attributes;
      attributes[action.entity] = action.attributes;
      return { ...state, attributes };
    }
    case ADD_FILTER: {
      const selectedFilters = state.selectedFilters;
      let filters = selectedFilters[action.entity];
      const emptyFilter = {
        name: '',
        operator: '',
      };
      filters = filters.concat(emptyFilter);
      selectedFilters[action.entity] = filters;
      return { ...state, selectedFilters };
    }
    case REMOVE_FILTER: {
      const selectedFilters = state.selectedFilters;
      let filters = selectedFilters[action.entity];
      filters.splice(action.index, 1);
      selectedFilters[action.entity] = [...filters];
      return { ...state, selectedFilters };
    }
    case REMOVE_ALL_FILTERS: {
      const selectedFilters = state.selectedFilters;
      selectedFilters[action.entity] = [];
      return { ...state, selectedFilters: selectedFilters };
    }
    case CHANGE_FILTER: {
      const selectedFilters = state.selectedFilters;
      let filters = selectedFilters[action.entity];
      filters[action.index] = action.filter;
      selectedFilters[action.entity] = [...filters];
      return { ...state, selectedFilters };
    }
    case SET_VALUES: {
      const values = state.values;
      const newValues = [...values, ...action.values];
      return { ...state, values: newValues };
    }
    case REMOVE_VALUE: {
      const value = state.selectedValue;
      const incomingValue = Object.keys(action.value).toString();
      const values = value.filter(val => {
        if (Object.keys(val).toString() !== incomingValue) {
          return val;
        } else {
          return null;
        }
      });
      const finalValues = [...values];
      return { ...state, selectedValue: finalValues };
    }
    case SET_VALUE: {
      const value = state.selectedValue;
      const incomingValue = Object.keys(action.value).toString();
      const values = [];
      value.forEach(val => {
        if (Object.keys(val).toString() !== incomingValue) {
          values.push(val);
        }
        // else if (Object.keys(val).toString() === incomingValue) {
        //   return null;
        // }
      });
      const finalValues = [...values, action.value];
      return { ...state, selectedValue: finalValues };
    }
    case SET_ROWS: {
      return { ...state, rowCount: action.rows };
    }
  }
  return state;
};
export default appReducer;
