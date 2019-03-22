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
  SET_SELECTED_VALUES,
  SET_ROWS,
  REMOVE_VALUE,
  COMPLETE_FULL_LOAD
} from './types';
import actionCreator from '../../utils/reduxHelpers';

export const setItemsAction = actionCreator(SET_ITEMS, 'entity', 'items');

export const setColumnsAction = actionCreator(SET_COLUMNS, 'entity', 'items');

export const setFilterAction = actionCreator(SET_FILTER, 'filters');

export const setTabAction = actionCreator(SET_TAB, 'entity');

export const setLoadingAction = actionCreator(SET_LOADING, 'isLoading');

export const initDataAction = actionCreator(INIT_DATA);

export const setNetworkAction = actionCreator(SET_NETWORK, 'network');

export const setAttributesAction = actionCreator(
  SET_ATTRIBUTES,
  'entity',
  'attributes'
);

export const addFilterAction = actionCreator(ADD_FILTER, 'entity');

export const removeFilterAction = actionCreator(
  REMOVE_FILTER,
  'entity',
  'index'
);

export const removeAllFiltersAction = actionCreator(
  REMOVE_ALL_FILTERS,
  'entity'
);

export const changeFilterAction = actionCreator(
  CHANGE_FILTER,
  'entity',
  'filter',
  'index'
);
export const completeFullLoadAction = actionCreator(COMPLETE_FULL_LOAD, 'isFullLoaded');
export const setAvailableValuesAction = actionCreator(
  SET_AVAILABLE_VALUES,
  'availableValues'
);
export const setSelectedValuesAction = actionCreator(
  SET_SELECTED_VALUES,
  'selectedValue'
);
export const setRowsAction = actionCreator(SET_ROWS, 'rows');
export const removeValueAction = actionCreator(REMOVE_VALUE, 'selectedValue');
