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
import actionCreator from '../../utils/reduxHelpers';

export const setItemsAction = actionCreator(SET_ITEMS, 'category', 'items');

export const setColumnsAction = actionCreator(SET_COLUMNS, 'category', 'items');

export const setFilterAction = actionCreator(SET_FILTER, 'filters');

export const setTabAction = actionCreator(SET_TAB, 'category');

export const setLoadingAction = actionCreator(SET_LOADING, 'isLoading');

export const initDataAction = actionCreator(INIT_DATA);

export const setNetworkAction = actionCreator(SET_NETWORK, 'network');

export const setAttributesAction = actionCreator(SET_ATTRIBUTES, 'category', 'attributes');

export const addFilterAction = actionCreator(ADD_FILTER, 'category');

export const removeFilterAction = actionCreator(REMOVE_FILTER, 'category', 'index');

export const changeFilterAction = actionCreator(CHANGE_FILTER, 'category', 'filter', 'index');
