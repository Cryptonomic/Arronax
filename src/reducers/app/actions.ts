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
  CHANGE_FILTER,
  ADD_VALUE,
  REMOVE_VALUE,
  CHANGE_VALUE,
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

export const changeFilterAction = actionCreator(
  CHANGE_FILTER,
  'entity',
  'filter',
  'index'
);

export const addValueAction = actionCreator(ADD_VALUE, 'value');
export const removeValueAction = actionCreator(REMOVE_VALUE, 'value', 'index');
export const changeValueAction = actionCreator(CHANGE_VALUE, 'value', 'index');
