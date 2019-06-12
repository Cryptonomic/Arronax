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

import { AttributeDefinition, EntityDefinition } from 'conseiljs';
import { Sort, Filter } from '../../types';

export function setItemsAction(entity: string, items: any[]) {
  return {
    type: SET_ITEMS,
    entity,
    items
  }
}

export function setColumnsAction(entity: string, items: any[]) {
  return {
    type: SET_COLUMNS,
    entity,
    items
  }
}

export function setFilterAction(filters: Filter[]) {
  return {
    type: SET_FILTER,
    filters
  }
}

export function setTabAction(entity: string) {
  return {
    type: SET_TAB,
    entity
  }
}

export function setLoadingAction(isLoading: boolean) {
  return {
    type: SET_LOADING,
    isLoading
  }
}

export function initDataAction() {
  return {
    type: INIT_DATA
  }
}

export function setNetworkAction(network: string) {
  return {
    type: SET_NETWORK,
    network
  }
}

export function setAttributesAction(entity: string, attributes: AttributeDefinition[]) {
  return {
    type: SET_ATTRIBUTES,
    entity,
    attributes
  }
}

export function addFilterAction(entity: string) {
  return {
    type: ADD_FILTER,
    entity
  }
}

export function removeFilterAction(entity: string, index: number) {
  return {
    type: REMOVE_FILTER,
    entity,
    index
  }
}

export function removeAllFiltersAction(entity: string) {
  return {
    type: REMOVE_ALL_FILTERS,
    entity
  }
}

export function changeFilterAction(entity: string, filter: Filter, index: number) {
  return {
    type: CHANGE_FILTER,
    entity,
    filter,
    index
  }
}

export function completeFullLoadAction(isFullLoaded: boolean) {
  return {
    type: COMPLETE_FULL_LOAD,
    isFullLoaded
  }
}

export function setAvailableValuesAction(entity: string, attribute: string, availableValues: any[]) {
  return {
    type: SET_AVAILABLE_VALUES,
    entity,
    attribute,
    availableValues
  }
}

export function setFilterCountAction(count: number) {
  return {
    type: SET_FILTER_COUNT,
    count
  }
}

export function setModalItemAction(item: any) {
  return {
    type: SET_MODAL_ITEM,
    item
  }
}

export function setSortAction(entity: string, sort: Sort) {
  return {
    type: SET_SORT,
    entity,
    sort
  }
}

export function setEntitiesAction(entities: EntityDefinition[]) {
  return {
    type: SET_ENTITIES,
    entities
  }
}

export function initEntityPropertiesAction(entity: string, filters: Filter[], sort: Sort, columns: any[], items: any[]) {
  return {
    type: INIT_ENTITY_PROPERTIES,
    entity,
    filters,
    sort,
    columns,
    items
  }
}

export function initFilterAction(entity: string, filters: Filter[]) {
  return {
    type: INIT_FILTER,
    entity,
    filters
  }
}