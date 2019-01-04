import {
  SET_ITEMS,
  SET_FILTER,
  SET_TAB,
  SET_LOADING,
  INIT_DATA,
  SET_NETWORK
} from './types';
import actionCreator from '../../utils/reduxHelpers';

export const setItemsAction = actionCreator(
  SET_ITEMS,
  'category',
  'items'
);
export const setFilterAction = actionCreator(
  SET_FILTER,
  'filters'
);

export const setTabAction = actionCreator(
  SET_TAB,
  'category'
);

export const setLoadingAction = actionCreator(
  SET_LOADING,
  'isLoading'
);

export const initDataAction = actionCreator(
  INIT_DATA
);

export const setNetworkAction = actionCreator(
  SET_NETWORK,
  'network'
);
