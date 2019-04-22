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
  SET_SELECTED_VALUES,
  REMOVE_VALUE,
  COMPLETE_FULL_LOAD,
  SET_FILTER_COUNT,
} from './types';

import { ConseilQueryBuilder, ConseilQuery } from 'conseiljs';
import { TezosAccount, TezosBlock, TezosOperation } from '../../types';
import { getLocalAttributes } from '../../utils/attributes';

const emptyFilters: ConseilQuery = ConseilQueryBuilder.blankQuery();
const attributes = getLocalAttributes();

export interface AppState {
  filters: ConseilQuery;
  network: string;
  blocks: TezosBlock[];
  availableValues: Array<string>;
  columns: object;
  attributes: object;
  operators: object;
  selectedFilters: object;
  accounts: TezosAccount[];
  operations: TezosOperation[];
  isLoading: boolean;
  selectedEntity: string;
  isFullLoaded: boolean;
  selectedValues: object;
  rowCount: number;
  filterCount: object;
}

const initialState: AppState = {
  filters: emptyFilters,
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
      { name: 'EQ', displayName: 'is' },
      { name: 'NOTEQ', displayName: 'is not' },
      { name: 'IN', displayName: 'is in' },
      { name: 'BETWEEN', displayName: 'is between' },
      { name: 'LT', displayName: 'is less than' },
      { name: 'GT', displayName: 'is greater than' },
      { name: 'ISNULL', displayName: 'is null' },
      { name: 'ISNOTNULL', displayName: 'is not null' },
    ],
    string: [
      { name: 'EQ', displayName: 'is' },
      { name: 'NOTEQ', displayName: 'is not' },
      { name: 'IN', displayName: 'is in' },
      { name: 'LIKE', displayName: 'is like' },
      { name: 'STARTSWITH', displayName: 'starts with' },
      { name: 'ENDSWITH', displayName: 'ends with' },
      { name: 'ISNULL', displayName: 'is null' },
      { name: 'ISNOTNULL', displayName: 'is not null' },
    ],
    dateTime: [
      { name: 'EQ', displayName: 'is' },
      { name: 'NOTEQ', displayName: 'is not' },
      { name: 'IN', displayName: 'is in' },
      { name: 'BETWEEN', displayName: 'is between' },
      { name: 'BEFORE', displayName: 'is before' },
      { name: 'AFTER', displayName: 'is after' },
      { name: 'ISNULL', displayName: 'is null' },
      { name: 'ISNOTNULL', displayName: 'is not null' },
    ],
    boolean: [{ name: 'EQ', displayName: 'is' }],
  },
  columns: {
    blocks: [],
    operations: [],
    accounts: [],
  },
  availableValues: [],
  accounts: [],
  operations: [],
  isLoading: false,
  selectedEntity: 'blocks',
  isFullLoaded: false,
  selectedValues: { blocks: [], operations: [], accounts: [] },
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
      return { ...state, ...initialState };
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
    case SET_AVAILABLE_VALUES: {
      const values = state.availableValues;
      const newValues = [...values, ...action.availableValues];
      return { ...state, availableValues: newValues };
    }
    case REMOVE_VALUE: {
      const selectedValues = state.selectedValues;
      const selectedEntity = state.selectedEntity;
      let value = state.selectedValues[selectedEntity];
      const incomingValue = Object.keys(action.selectedValue).toString();
      const values = value.filter(val => {
        if (Object.keys(val).toString() !== incomingValue) {
          return val;
        } else {
          return null;
        }
      });
      const finalValues = [...values];
      selectedValues[selectedEntity] = finalValues;
      return { ...state, selectedValues };
    }
    case SET_SELECTED_VALUES: {
      const selectedValues = state.selectedValues;
      const selectedEntity = state.selectedEntity;
      let value = state.selectedValues[selectedEntity];
      const incomingValue = Object.keys(action.selectedValue).toString();
      const values = [];
      value.forEach(val => {
        if (Object.keys(val).toString() !== incomingValue) {
          values.push(val);
        }
      });
      const finalValues = [...values, action.selectedValue];
      selectedValues[selectedEntity] = finalValues;
      return { ...state, selectedValues };
    }
    case SET_FILTER_COUNT: {
      const selectedEntity = state.selectedEntity;
      const filterCount = state.filterCount;
      filterCount[selectedEntity] = action.count;
      return { ...state, filterCount: filterCount };
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
