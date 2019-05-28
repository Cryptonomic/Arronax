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
  SET_AVAILABLE_VALUES,
  COMPLETE_FULL_LOAD,
  SET_FILTER_COUNT,
  SET_MODAL_ITEM,
  SET_SORT,
  SET_ENTITIES,
  INIT_ENTITY_PROPERTIES,
  INIT_FILTER
} from './types';

import { ConseilQueryBuilder, ConseilQuery } from 'conseiljs';
import { Filter, EntityDefinition } from '../../types';
import { getLocalAttributes } from '../../utils/attributes';

const emptyFilters: ConseilQuery = ConseilQueryBuilder.blankQuery();
const attributes = getLocalAttributes();

export interface AppState {
  platform: string;
  network: string;
  entities: EntityDefinition[],
  filters: ConseilQuery;
  availableValues: object;
  columns: object;
  attributes: object;
  items: object;
  operators: object;
  selectedFilters: object;
  isLoading: boolean;
  selectedEntity: string;
  isFullLoaded: boolean;
  rowCount: number;
  filterCount: object;
  selectedModalItem: object;
  sort: object;
}

const initialState: AppState = {
  filters: emptyFilters,
  platform: 'tezos',
  network: 'alphanet',
  entities: [],
  attributes: attributes,
  items: {},
  selectedFilters: {},
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
      { name: 'notstartWith', displayName: 'does not start with' },
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

  },
  availableValues: {},
  isLoading: false,
  selectedEntity: '',
  isFullLoaded: false,
  rowCount: 50,
  filterCount: {},
  selectedModalItem: {},
  sort: {}
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
      const items = { ...state.items, [action.entity]: action.items };
      return { ...state, items };
    case SET_COLUMNS: {
      const columns = {...state.columns, [action.entity]: action.items};
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
      const attributes = { ...state.attributes, [action.entity]: action.attributes};
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
      entityValues[action.attribute] = action.availableValues.sort();
      availableValues[action.entity] = entityValues;
      return { ...state, availableValues };
    }
    case SET_FILTER_COUNT: {
      const selectedEntity = state.selectedEntity;
      const filterCount = { ...state.filterCount, [selectedEntity]: action.count };
      return { ...state, filterCount };
    }
    case COMPLETE_FULL_LOAD:
      return { ...state, isFullLoaded: action.isFullLoaded };
    case SET_MODAL_ITEM:
      return { ...state, selectedModalItem: action.item };
    case SET_SORT: {
      const sort = {...state.sort, [action.entity]: action.sort};
      return { ...state, sort };
    }
    case SET_ENTITIES: {
      const entities = action.entities;
      const selectedEntity = entities[0].name;
      return { ...state, entities, selectedEntity };
    }
    case INIT_ENTITY_PROPERTIES: {
      const filterCount = { ...state.filterCount, [action.entity]: action.filters.length };
      const sort = { ...state.sort, [action.entity]: action.sort};
      const columns = { ...state.columns, [action.entity]: action.columns };
      const items = { ...state.items, [action.entity]: action.items };
      const selectedFilters = { ...state.selectedFilters, [action.entity]: action.filters };
      const availableValues = { ...state.availableValues, [action.entity]: {} };

      return {
        ...state,
        sort,
        filterCount,
        selectedFilters,
        availableValues,
        columns,
        items
      };
    }
    case INIT_FILTER: {
      const selectedFilters = {...state.selectedFilters, [action.entity]: action.filters};
      const filterCount = { ...state.filterCount, [action.entity]: action.filters.length };
      return { ...state, selectedFilters, filterCount };
    }
  }
  return state;
};
export default appReducer;
