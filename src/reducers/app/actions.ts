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
export const completeFullLoadAction = actionCreator(
  COMPLETE_FULL_LOAD,
  'isFullLoaded'
);
export const setAvailableValuesAction = actionCreator(
  SET_AVAILABLE_VALUES,
  'entity',
  'attribute',
  'availableValues'
);

export const setFilterCountAction = actionCreator(SET_FILTER_COUNT, 'count');
export const setModalItemAction = actionCreator(SET_MODAL_ITEM, 'item');

export const setSortAction = actionCreator(SET_SORT, 'entity', 'sort');
export const setEntitiesAction = actionCreator(SET_ENTITIES, 'entities');

export const initEntityPropertiesAction = actionCreator(INIT_ENTITY_PROPERTIES, 'entity', 'filters', 'sort', 'columns', 'items');
export const initFilterAction = actionCreator(INIT_FILTER, 'entity', 'filters');