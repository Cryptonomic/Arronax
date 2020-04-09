import {
    SET_ITEMS,
    SET_FILTER,
    SET_TAB,
    SET_LOADING,
    SET_CONFIG,
    ADD_CONFIG,
    REMOVE_CONFIG,
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
    SET_ENTITY,
    SET_ENTITY_PROPERTIES,
    INIT_FILTER,
    SET_AGGREGATIONS,
    SET_SUBMIT,
    SET_QUERY_FILTERS,
} from './types';

import { EntityDefinition } from 'conseiljs';
import { Filter, Config } from '../../types';
import { getLocalAttributes } from '../../utils/attributes';
import { getConfigs, saveConfigs } from '../../utils/getconfig';

const attributes = getLocalAttributes();
const configs = getConfigs();

export interface AppState {
    entities: EntityDefinition[];
    commonEntites: EntityDefinition[];
    availableValues: any;
    columns: object;
    attributes: object;
    items: object;
    operators: object;
    selectedFilters: any;
    queryFilters: any;
    isLoading: boolean;
    selectedEntity: string;
    isFullLoaded: boolean;
    rowCount: number;
    filterCount: any;
    selectedModalItem: object[];
    selectedModalSubItem: object[];
    sort: object;
    configs: Config[];
    selectedConfig: Config;
    aggregations: object;
    aggFunctions: object;
}

let initialState: AppState = {
    configs,
    selectedConfig: configs[0],
    entities: [],
    commonEntites: [],
    attributes,
    items: {},
    selectedFilters: {},
    queryFilters: {},
    operators: {
        numeric: [
            { name: 'eq', displayName: 'is' },
            { name: 'noteq', displayName: 'is not' },
            { name: 'in', displayName: 'in' },
            { name: 'notin', displayName: 'not in' },
            { name: 'between', displayName: 'between' },
            { name: 'lt', displayName: 'less than' },
            { name: 'gt', displayName: 'greater than' },
            { name: 'isnull', displayName: 'is null' },
            { name: 'isnotnull', displayName: 'is not null' },
        ],
        string: [
            { name: 'eq', displayName: 'is' },
            { name: 'noteq', displayName: 'is not' },
            { name: 'in', displayName: 'in' },
            { name: 'notin', displayName: 'not in' },
            { name: 'like', displayName: 'like' },
            { name: 'startsWith', displayName: 'starts with' },
            { name: 'notstartWith', displayName: 'does not start with' },
            { name: 'endsWith', displayName: 'ends with' },
            { name: 'notendWith', displayName: 'does not end with' },
            { name: 'isnull', displayName: 'is null' },
            { name: 'isnotnull', displayName: 'is not null' },
        ],
        dateTime: [
            { name: 'eq', displayName: 'is' },
            { name: 'noteq', displayName: 'is not' },
            { name: 'between', displayName: 'between' },
            { name: 'before', displayName: 'before' },
            { name: 'after', displayName: 'after' },
            { name: 'isnull', displayName: 'is null' },
            { name: 'isnotnull', displayName: 'is not null' },
        ],
        boolean: [{ name: 'eq', displayName: 'is' }],
    },
    columns: {},
    availableValues: {},
    isLoading: false,
    selectedEntity: '',
    isFullLoaded: false,
    rowCount: 50,
    filterCount: {},
    selectedModalItem: [],
    selectedModalSubItem: [],
    sort: {},
    aggregations: {},
    aggFunctions: {
        numeric: [
            { name: 'sum', displayName: 'Sum' },
            { name: 'avg', displayName: 'Average' },
            { name: 'min', displayName: 'Min' },
            { name: 'max', displayName: 'Max' },
            { name: 'count', displayName: 'Count' },
        ],
        string: [{ name: 'count', displayName: 'Count' }],
        dateTime: [
            { name: 'min', displayName: 'Min' },
            { name: 'max', displayName: 'Max' },
            { name: 'count', displayName: 'Count' },
        ],
    },
};

export const app = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_FILTER:
            return { ...state, filters: action.filters };
        case SET_ITEMS: {
            const items = { ...state.items, [action.entity]: action.items };
            return { ...state, items };
        }
        case SET_COLUMNS: {
            const columns = { ...state.columns, [action.entity]: action.columns };
            const sort = { ...state.sort, [action.entity]: action.sorts };
            const aggregations = { ...state.aggregations, [action.entity]: action.aggregations };
            return { ...state, columns, sort, aggregations };
        }
        case SET_TAB:
            return { ...state, selectedEntity: action.entity };
        case SET_LOADING:
            return { ...state, isLoading: action.isLoading };
        case SET_CONFIG:
            return { ...state, selectedConfig: action.config };
        case ADD_CONFIG: {
            let selectedConfig = state.selectedConfig;
            const configs = state.configs;
            if (action.isUse) {
                selectedConfig = action.config;
            }
            const newConfigs = [...configs, action.config];
            initialState = { ...initialState, configs: newConfigs };
            saveConfigs(newConfigs);
            return { ...state, selectedConfig, configs: newConfigs };
        }
        case REMOVE_CONFIG: {
            let configs = state.configs;
            configs.splice(action.index, 1);
            initialState = { ...initialState, configs };
            saveConfigs(configs);
            return { ...state, configs };
        }
        case ADD_FILTER: {
            const selectedFilters = { ...state.selectedFilters };
            let filters = selectedFilters[action.entity];
            const emptyFilter: Filter = {
                name: '',
                operator: '',
                operatorType: '',
                isLowCardinality: false,
                values: [''],
            };
            filters = filters.concat(emptyFilter);
            selectedFilters[action.entity] = filters;
            return { ...state, selectedFilters };
        }
        case REMOVE_FILTER: {
            const selectedFilters = { ...state.selectedFilters };
            let filters = selectedFilters[action.entity];
            filters.splice(action.index, 1);
            selectedFilters[action.entity] = [...filters];
            return { ...state, selectedFilters };
        }
        case REMOVE_ALL_FILTERS: {
            const selectedFilters = { ...state.selectedFilters };
            selectedFilters[action.entity] = [];
            const selectedEntity = state.selectedEntity;
            const filterCount = { ...state.filterCount };
            filterCount[selectedEntity] = 0;
            return { ...state, selectedFilters, filterCount };
        }
        case CHANGE_FILTER: {
            const selectedFilters = { ...state.selectedFilters };
            let filters = selectedFilters[action.entity];
            filters[action.index] = action.filter;
            selectedFilters[action.entity] = [...filters];
            return { ...state, selectedFilters };
        }
        case SET_AVAILABLE_VALUES: {
            const availableValues = { ...state.availableValues };
            const entityValues = { ...availableValues[action.entity] };
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
            const isFullLoaded = action.isFullLoaded;
            return {
                ...state,
                isFullLoaded,
            };
        case SET_MODAL_ITEM:
            return { ...state, selectedModalItem: action.item, selectedModalSubItem: action.subItem };
        case SET_SORT: {
            const sort = { ...state.sort, [action.entity]: action.sorts };
            return { ...state, sort };
        }
        case SET_ENTITIES: {
            return { ...state, entities: action.entities, commonEntites: action.commonEntites };
        }
        case SET_ENTITY: {
            return { ...state, selectedEntity: action.entity };
        }
        case SET_ENTITY_PROPERTIES: {
            const filterCount = { ...state.filterCount, [action.entity]: action.filters.length };
            const sort = { ...state.sort, [action.entity]: action.sorts };
            const columns = { ...state.columns, [action.entity]: action.columns };
            const items = { ...state.items, [action.entity]: action.items };
            const selectedFilters = { ...state.selectedFilters, [action.entity]: action.filters };
            const aggregations = { ...state.aggregations, [action.entity]: action.aggregations };
            const entityValues = { ...state.availableValues[action.entity] } || {};
            const availableValues = { ...state.availableValues, [action.entity]: entityValues };

            return {
                ...state,
                sort,
                filterCount,
                selectedFilters,
                availableValues,
                columns,
                items,
                aggregations,
            };
        }
        case INIT_FILTER: {
            const selectedFilters = { ...state.selectedFilters, [action.entity]: action.filters };
            const filterCount = { ...state.filterCount, [action.entity]: action.filters.length };
            return { ...state, selectedFilters, filterCount };
        }
        case SET_ATTRIBUTES: {
            return { ...state, attributes: action.attributes };
        }
        case SET_AGGREGATIONS: {
            const sort = { ...state.sort, [action.entity]: action.sorts };
            const aggregations = { ...state.aggregations, [action.entity]: action.aggregations };
            return { ...state, aggregations, sort };
        }

        case SET_SUBMIT: {
            const items = { ...state.items, [action.entity]: action.items };
            const filterCount = { ...state.filterCount, [action.entity]: action.filterCount };
            return { ...state, items, filterCount };
        }

        case SET_QUERY_FILTERS: {
            const { queryFilters, entity } = action;
            const filters = { ...state.queryFilters, [entity]: queryFilters };
            return { ...state, queryFilters: filters };
        }
    }
    return state;
};
