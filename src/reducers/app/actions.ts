import { SET_ITEMS, SET_FILTER, SET_TAB, SET_LOADING } from './types';
import actionCreator from '../../utils/reduxHelpers';

export const setItemsAction = actionCreator(
  SET_ITEMS,
  'category',
  'items'
);
export const setFilterAction = actionCreator(
  SET_FILTER,
  'filter'
);

export const setTabAction = actionCreator(
  SET_TAB,
  'category'
);

export const setLoadingAction = actionCreator(
  SET_LOADING,
  'isLoading'
);
