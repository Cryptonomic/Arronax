import {
    SET_ITEMS,
    SET_FILTER,
    SET_TAB,
    SET_LOADING,
    SET_COLUMNS,
    SET_ATTRIBUTES,
    ADD_FILTER,
    REMOVE_FILTER,
    REMOVE_ALL_FILTERS,
    CHANGE_FILTER,
    SET_AVAILABLE_VALUES,
    COMPLETE_FULL_LOAD,
    SET_FILTER_COUNT,
    SET_SORT,
    SET_ENTITIES,
    SET_ENTITY,
    SET_ENTITY_PROPERTIES,
    INIT_FILTER,
    SET_CONFIG,
    ADD_CONFIG,
    REMOVE_CONFIG,
    SET_AGGREGATIONS,
    SET_SUBMIT,
    SET_QUERY_FILTERS,
    SET_HOURLY_TRANSACTIONS_LOADING,
    SET_HOURLY_TRANSACTIONS,
    SET_HOURLY_TRANSACTIONS_QUERY_URL,
    SET_TOP_ACCOUNTS,
    SET_TOP_ACCOUNTS_QUERY_URL,
    SET_TOP_BAKERS,
    SET_TOP_BAKERS_QUERY_URL,
    SET_TOP_ACCOUNTS_LOADING,
    SET_TOP_BAKERS_LOADING
} from './types';

import { AttributeDefinition, EntityDefinition } from 'conseiljs';
import { Sort, Filter, Config, Aggregation } from '../../types';

// remove?
export function setItemsAction(entity: string, items: any[]) {
    return {
        type: SET_ITEMS,
        entity,
        items,
    };
}

export function setColumnsAction(entity: string, columns: AttributeDefinition[], sorts: Sort[], aggregations: Aggregation[]) {
    return {
        type: SET_COLUMNS,
        entity,
        columns,
        sorts,
        aggregations,
    };
}

// remove?
export function setFilterAction(filters: Filter[]) {
    return {
        type: SET_FILTER,
        filters,
    };
}

export function setTabAction(entity: string) {
    return {
        type: SET_TAB,
        entity,
    };
}

export function setLoadingAction(isLoading: boolean) {
    return {
        type: SET_LOADING,
        isLoading,
    };
}

export function setConfigAction(config: Config) {
    return {
        type: SET_CONFIG,
        config,
    };
}

export function addConfigAction(config: Config, isUse: boolean) {
    return {
        type: ADD_CONFIG,
        config,
        isUse,
    };
}

export function removeConfigAction(index: number) {
    return {
        type: REMOVE_CONFIG,
        index,
    };
}

export function addFilterAction(entity: string) {
    return {
        type: ADD_FILTER,
        entity,
    };
}

export function removeFilterAction(entity: string, index: number) {
    return {
        type: REMOVE_FILTER,
        entity,
        index,
    };
}

export function removeAllFiltersAction(entity: string) {
    return {
        type: REMOVE_ALL_FILTERS,
        entity,
    };
}

export function changeFilterAction(entity: string, filter: Filter, index: number) {
    return {
        type: CHANGE_FILTER,
        entity,
        filter,
        index,
    };
}

export function completeFullLoadAction(isFullLoaded: boolean) {
    return {
        type: COMPLETE_FULL_LOAD,
        isFullLoaded,
    };
}

export function setAvailableValuesAction(entity: string, attribute: string, availableValues: any[]) {
    return {
        type: SET_AVAILABLE_VALUES,
        entity,
        attribute,
        availableValues,
    };
}

// remove?
export function setFilterCountAction(count: number) {
    return {
        type: SET_FILTER_COUNT,
        count,
    };
}

export function setSortAction(entity: string, sorts: Sort[]) {
    return { type: SET_SORT, entity, sorts };
}

export function setEntitiesAction(entities: EntityDefinition[]) {
    return {
        type: SET_ENTITIES,
        entities,
    };
}

export function setEntityAction(entity: string) {
    return {
        type: SET_ENTITY,
        entity,
    };
}

export function setEntityPropertiesAction(entity: string, filters: Filter[], sorts: Sort[], columns: any[], items: any[], aggregations: Aggregation[]) {
    return {
        type: SET_ENTITY_PROPERTIES,
        entity,
        filters,
        sorts,
        columns,
        items,
        aggregations,
    };
}

export function initFilterAction(entity: string, filters: Filter[]) {
    return {
        type: INIT_FILTER,
        entity,
        filters,
    };
}

export function setAttributesAction(attributes: any) {
    return {
        type: SET_ATTRIBUTES,
        attributes,
    };
}

export function setAggregationAction(entity: string, aggregations: Aggregation[], sorts: Sort[]) {
    return {
        type: SET_AGGREGATIONS,
        entity,
        aggregations,
        sorts,
    };
}

export function setSubmitAction(entity: string, items: any[], filterCount: number) {
    return {
        type: SET_SUBMIT,
        entity,
        items,
        filterCount,
    };
}

export const setQueryFilters = (entity: string, queryFilters: any): any => ({
    type: SET_QUERY_FILTERS,
    entity,
    queryFilters,
});

export function setHourlyTransactionsLoadingAction(isTransactionsLoading: boolean) {
    return {
        type: SET_HOURLY_TRANSACTIONS_LOADING,
        isTransactionsLoading,
    };
}


export function setHourlyTransactions(hourlytransactions: Array<object>) {
    return {
        type: SET_HOURLY_TRANSACTIONS,
        hourlytransactions,
    };
}

export function setHourlyTransactionsQueryUrl(hourlytransactionsUrl: string) {
    return {
        type: SET_HOURLY_TRANSACTIONS_QUERY_URL,
        hourlytransactionsUrl,
    };
}

export function setTopAccounts(topAccounts: Array<object>) {
    return {
        type: SET_TOP_ACCOUNTS,
        topAccounts,
    }
}

export function setTopAccountsLoadingAction(isTopAccountsLoading: boolean) {
    return {
        type: SET_TOP_ACCOUNTS_LOADING,
        isTopAccountsLoading,
    }
}

export function setTopBakers(topBakers: Array<object>) {
    return {
        type: SET_TOP_BAKERS,
        topBakers,
    }
}

export function setTopBakersLoadingAction(isTopBakersLoading: boolean) {
    return {
        type: SET_TOP_BAKERS_LOADING,
        isTopBakersLoading,
    }
}

export function setTopAccountsQueryUrl(topAccountsUrl: string) {
    return {
        type: SET_TOP_ACCOUNTS_QUERY_URL,
        topAccountsUrl,
    }
}

export function setTopBakersQueryUrl(topBakersUrl: string) {
    return {
        type: SET_TOP_BAKERS_QUERY_URL,
        topBakersUrl,
    }
}