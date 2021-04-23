import base64url from 'base64url';
import { hocon } from 'hocon-web';

import {
    ConseilMetadataClient,
    ConseilDataClient,
    ConseilQueryBuilder,
    ConseilOperator,
    ConseilOutput,
    ConseilSortDirection,
    AttributeDefinition,
    AttrbuteDataType,
    TezosConseilClient,
    EntityDefinition,
    ConseilFunction
} from 'conseiljs';

import {
    setAvailableValuesAction,
    setLoadingAction,
    setConfigAction,
    setColumnsAction,
    setAttributesAction,
    completeFullLoadAction,
    setEntitiesAction,
    setEntityAction,
    setEntityPropertiesAction,
    initFilterAction,
    setTabAction,
    setSubmitAction,
    setAggregationAction,
    setQueryFilters,
    setHourlyTransactionsLoadingAction,
    setHourlyTransactions,
    setHourlyTransactionsQueryUrl,
    setTopAccounts,
    setTopAccountsLoadingAction,
    setTopBakers,
    setTopBakersLoadingAction,
    setTopBakersQueryUrl,
    setTopAccountsQueryUrl,
} from './actions';
import { setModalItems, setModalOpen } from '../modal/actions';
import { createMessageAction } from '../message/actions';
import { loadModal } from '../modal/thunk';

import { getTimeStampFromLocal, saveAttributes, validateCache } from '../../utils/attributes';
import { defaultQueries, CARDINALITY_NUMBER } from '../../utils/defaultQueries';
import { getOperatorType, sortAttributes, isOS } from '../../utils/general';
import { defaultPath } from '../../router/routes';

import { Config, Sort, Filter, Aggregation, InitLoad } from '../../types';

const { executeEntityQuery } = ConseilDataClient;
const { blankQuery, addOrdering, addFields, setLimit, addPredicate, addAggregationFunction } = ConseilQueryBuilder;

const CACHE_TIME = 432000000; // 5*24*3600*1000
const CACHE_VERSION = 4;

let InitProperties: any = {};

const { getAttributes, getAttributeValues, getEntities, getAttributeValuesForPrefix } = ConseilMetadataClient;

const getAttributeNames = (attributes: AttributeDefinition[]) => attributes.map((attr) => attr.name);

export const fetchValues = (attribute: string) => async (dispatch: any, state: any) => {
    const { selectedEntity, selectedConfig } = state().app;
    const { network, platform, url, apiKey } = selectedConfig;
    dispatch(setLoadingAction(true));
    const serverInfo = { url, apiKey, network };
    const values = await getAttributeValues(serverInfo, platform, network, selectedEntity, attribute);
    dispatch(setAvailableValuesAction(selectedEntity, attribute, values));
    dispatch(setLoadingAction(false));
};

const initCardinalityValues = (platform: string, entity: string, network: string, attribute: string, serverInfo: any) => async (dispatch: any) => {
    const values = await getAttributeValues(serverInfo, platform, network, entity, attribute);
    await dispatch(setAvailableValuesAction(entity, attribute, values));
};

function clearSortAndAggregations(columns: AttributeDefinition[], sort: Sort, aggregations: Aggregation[]) {
    const sortedColumn = columns.find((col) => col.name === sort.orderBy);
    let newSort = { ...sort };
    if (!sortedColumn) {
        const levelColumn = columns.find((column) => column.name === 'level' || column.name === 'block_level' || column.name === 'timestamp') || columns[0];
        newSort = {
            orderBy: levelColumn.name,
            order: ConseilSortDirection.DESC,
        };
    }
    const newAggs: any = [];
    aggregations.forEach((agg) => {
        const colIndex = columns.findIndex((col) => col.name === agg.field);
        if (colIndex > -1) {
            newAggs.push(agg);
            if (agg.field === newSort.orderBy) {
                newSort = {
                    ...newSort,
                    orderBy: `${agg.function}_${newSort.orderBy}`,
                };
            }
        }
    });

    return {
        sorts: [newSort],
        aggs: newAggs,
    };
}

export const setAggregationsThunk = (aggregations: Aggregation[]) => async (dispatch: any, state: any) => {
    const { selectedEntity, sort, columns } = state().app;
    let selectedSorts = sort[selectedEntity];
    const selectedColumns = columns[selectedEntity];
    const { sorts, aggs } = clearSortAndAggregations(selectedColumns, selectedSorts, aggregations);
    const sortColumn = selectedColumns.find((col: any) => col.name === selectedSorts[0].orderBy);
    const sortAgg = aggregations.find((agg) => selectedSorts[0].orderBy === `${agg.function}_${agg.field}` || selectedSorts[0].orderBy === agg.field);
    if ((!sortColumn && !sortAgg) || (sortColumn && sortAgg)) {
        selectedSorts = sorts;
    }
    await dispatch(setAggregationAction(selectedEntity, aggs, selectedSorts));
};

export const setColumnsThunk = (columns: AttributeDefinition[]) => async (dispatch: any, state: any) => {
    const { selectedEntity, sort, aggregations } = state().app;
    const { sorts, aggs } = clearSortAndAggregations(columns, sort[selectedEntity], aggregations[selectedEntity]);

    await dispatch(setColumnsAction(selectedEntity, columns, sorts, aggs));
};

export const resetColumns = () => async (dispatch: any, state: any) => {
    const { selectedEntity, sort, aggregations, attributes } = state().app;
    const initProperty = InitProperties[selectedEntity];
    const columns = initProperty ? initProperty.columns : sortAttributes(attributes[selectedEntity]);
    const { sorts, aggs } = clearSortAndAggregations(columns, sort[selectedEntity], aggregations[selectedEntity]);
    await dispatch(setColumnsAction(selectedEntity, columns, sorts, aggs));
};

export const resetFilters = () => async (dispatch: any, state: any) => {
    const { selectedEntity } = state().app;
    const initProperty = InitProperties[selectedEntity];
    const filters = initProperty ? initProperty.filters : [];
    await dispatch(initFilterAction(selectedEntity, filters));
};

export const resetAggregations = () => async (dispatch: any, state: any) => {
    const { selectedEntity, columns, sort } = state().app;
    const initProperty = InitProperties[selectedEntity];
    const aggregations = initProperty ? initProperty.aggregations : [];
    const { sorts } = clearSortAndAggregations(columns[selectedEntity], sort[selectedEntity], aggregations);
    await dispatch(setAggregationAction(selectedEntity, aggregations, sorts));
};

export const fetchInitEntityAction = (
    platform: string,
    entity: string,
    network: string,
    serverInfo: any,
    attributes: AttributeDefinition[],
    urlEntity: string,
    urlQuery: any
) => async (dispatch: any, state: any) => {
    const { entities } = state().app;
    let defaultQuery: any = urlEntity === entity && urlQuery ? JSON.parse(base64url.decode(urlQuery)) : defaultQueries[platform][entity];
    defaultQuery = { ...ConseilQueryBuilder.blankQuery(), ...defaultQuery };
    let columns: any[] = [];
    let sorts: Sort[];
    let filters: Filter[] = [];
    let aggregations: Aggregation[] = [];
    let cardinalityPromises: any[] = [];
    let query: any = blankQuery();
    const sortedAttributes = sortAttributes(attributes);
    const levelColumn =
        attributes.find((column) => column.name === 'level' || column.name === 'block_level' || column.name === 'timestamp') || sortedAttributes[0];

    if (defaultQuery) {
        const { fields, predicates, orderBy } = defaultQuery;
        query = defaultQuery;
        // initColumns
        if (fields.length > 0) {
            fields.forEach((field: any) => {
                const column = attributes.find((attr) => attr.name === field);
                if (column) {
                    columns.push(column);
                }
            });
        } else {
            columns = [...sortedAttributes];
        }

        if (orderBy.length > 0) {
            sorts = orderBy.map((o: any) => {
                return { orderBy: o.field, order: o.direction };
            });
        } else {
            // adding the default sort
            sorts = [
                {
                    orderBy: levelColumn.name,
                    order: ConseilSortDirection.DESC,
                },
            ];
            query = addOrdering(query, sorts[0].orderBy, sorts[0].order);
        }
        // initFilters
        filters = predicates.map((predicate: any) => {
            const selectedAttribute: any = attributes.find((attr) => attr.name === predicate.field);
            const isLowCardinality = selectedAttribute.cardinality !== undefined && selectedAttribute.cardinality < CARDINALITY_NUMBER;
            if (isLowCardinality) {
                cardinalityPromises.push(dispatch(initCardinalityValues(platform, entity, network, selectedAttribute.name, serverInfo)));
            }
            const operatorType = getOperatorType(selectedAttribute.dataType);

            let operator = predicate.operation;
            if (predicate.inverse) {
                if (predicate.operation === ConseilOperator.ISNULL) {
                    operator = 'isnotnull';
                } else if (predicate.operation === ConseilOperator.EQ) {
                    operator = 'noteq';
                } else if (predicate.operation === ConseilOperator.STARTSWITH) {
                    operator = 'notstartWith';
                } else if (predicate.operation === ConseilOperator.ENDSWITH) {
                    operator = 'notendWith';
                } else if (predicate.operation === ConseilOperator.IN) {
                    operator = 'notin';
                }
            }

            return {
                name: predicate.field,
                operator,
                values: predicate.set,
                operatorType,
                isLowCardinality,
            };
        });

        predicates.forEach((predicate: any) => {
            const selectedAttribute: any = attributes.find((attr) => attr.name === predicate.field);
            if (selectedAttribute.dataType === AttrbuteDataType.DATETIME) {
                for (let i = 0; i < predicate.set.length; i++) {
                    if (Number(predicate.set[i]) < 0) {
                        predicate.set[i] = new Date().getTime() + predicate.set[i];
                    }
                }
            }
        });

        if (!!query.aggregation && query.aggregation.length > 0) {
            aggregations = query.aggregation.map((agg: any) => {
                const selectedAttribute: any = attributes.find((attr) => attr.name === agg.field);
                const type = getOperatorType(selectedAttribute.dataType);
                return { ...agg, type };
            });
        }

        // These values are used when reset columns or filters
        const initProperty = { columns, filters, aggregations };
        InitProperties = { ...InitProperties, [entity]: initProperty };
    } else {
        query = addFields(query, ...getAttributeNames(sortedAttributes));
        columns = [...sortedAttributes];
        query = setLimit(query, 1000);
        sorts = [{ orderBy: levelColumn.name, order: ConseilSortDirection.DESC }];
        query = addOrdering(query, sorts[0].orderBy, sorts[0].order);
    }

    const items = await executeEntityQuery(serverInfo, platform, network, entity, query).catch(() => {
        const name = entities.find((e: EntityDefinition) => e.name === entity)?.displayName.toLowerCase();
        dispatch(createMessageAction(`Unable to retrieve data for ${name} request.`, true));
        return [];
    });
    await dispatch(setQueryFilters(entity, query));
    await dispatch(setEntityPropertiesAction(entity, filters, sorts, columns, items, aggregations));
    await Promise.all(cardinalityPromises);
};

export const loadHourlyTransactions = (date: number) => async (dispatch: any, state: any) => {
    try {
        dispatch(setHourlyTransactionsLoadingAction(true));
        const { selectedConfig } = state().app;
        const { network, url, apiKey } = selectedConfig;
        const serverInfo = { url, apiKey, network };

        let query = ConseilQueryBuilder.blankQuery();
        query = ConseilQueryBuilder.addFields(query, 'kind', 'timestamp');
        query = ConseilQueryBuilder.addPredicate(query, 'kind', ConseilOperator.EQ, ['transaction']);
        query = ConseilQueryBuilder.addPredicate(query, 'status', ConseilOperator.EQ, ['applied']);
        query = ConseilQueryBuilder.addPredicate(query, 'timestamp', ConseilOperator.BETWEEN, [date, new Date().getTime()]);
        query = ConseilQueryBuilder.addAggregationFunction(query, 'kind', ConseilFunction.count);
        query = ConseilQueryBuilder.addOrdering(query, "timestamp", ConseilSortDirection.ASC);
        query = ConseilQueryBuilder.setLimit(query, 50_000);

        const result = await ConseilDataClient.executeEntityQuery(serverInfo, 'tezos', network, 'operations', query);

        const queryUrl = shareQuery('tezos', 'mainnet', 'operations', query);
        dispatch(setHourlyTransactionsQueryUrl(queryUrl));
        dispatch(setHourlyTransactions(result));
        dispatch(setHourlyTransactionsLoadingAction(false));
    } catch (e) {
        const message = e.message || `Unable to load transactions data for Home page.`;
        await dispatch(createMessageAction(message, true));
    }
};

export const fetchTopAccounts = (limit: number) => async (dispatch: any, state: any) => {
    try {
        dispatch(setTopAccountsLoadingAction(true));
        const { selectedConfig } = state().app;
        const { network, url, apiKey } = selectedConfig;
        const serverInfo = { url, apiKey, network };

        let query = ConseilQueryBuilder.blankQuery();
        query = ConseilQueryBuilder.addFields(query, 'balance', 'account_id');
        query = ConseilQueryBuilder.addOrdering(query, "balance", ConseilSortDirection.DESC);
        query = ConseilQueryBuilder.setLimit(query, limit);

        const result = await ConseilDataClient.executeEntityQuery(serverInfo, 'tezos', network, 'accounts', query)
        result.forEach(element  => {
            element.balance = Math.floor(element.balance / 1000000.0)
        });

        const queryUrl = shareQuery('tezos', 'mainnet', 'accounts', query);

        dispatch(setTopAccountsQueryUrl(queryUrl));
        dispatch(setTopAccounts(result));
        dispatch(setTopAccountsLoadingAction(false));
    } catch (e) {
        const message = e.message || `Unable to load account data for Home page.`;
        await dispatch(createMessageAction(message, true));
    }
};

export const fetchTopBakers = (date: number, limit: number) => async (dispatch: any, state: any) => {
    try {
        dispatch(setTopBakersLoadingAction(true));
        const { selectedConfig } = state().app;
        const { network, url, apiKey } = selectedConfig;
        const serverInfo = { url, apiKey, network };

        let query = ConseilQueryBuilder.blankQuery();
        query = ConseilQueryBuilder.addFields(query, 'baker', 'hash');
        query = ConseilQueryBuilder.addPredicate(query, 'timestamp', ConseilOperator.AFTER, [date]);
        query = ConseilQueryBuilder.addAggregationFunction(query, 'hash', ConseilFunction.count);
        query = ConseilQueryBuilder.addOrdering(query, 'count_hash', ConseilSortDirection.DESC);
        query = ConseilQueryBuilder.setLimit(query, limit);

        const result = await ConseilDataClient.executeEntityQuery(serverInfo, 'tezos', network, 'blocks', query);
        const queryUrl = shareQuery('tezos', 'mainnet', 'blocks', query);

        dispatch(setTopBakersQueryUrl(queryUrl));
        dispatch(setTopBakers(result));
        dispatch(setTopBakersLoadingAction(false));
    } catch (e) {
        const message = e.message || `Unable to load baker data for Home page.`;
        await dispatch(createMessageAction(message, true));
    }
};

const shareQuery = (platform: string, network: string, entity: string, query: object) => {
    const encodedUrl = btoa(JSON.stringify(query));
    return `/${platform}/${network}/${entity}/query/${encodedUrl}`;
};

const loadEntities = () => async (dispatch: any, state: any) => {
    const selectedConfig: Config = state().app.selectedConfig;
    const { platform, network, url, apiKey } = selectedConfig;
    let configEntities: EntityDefinition[] = [];
    let responseEntities: EntityDefinition[] = [];
    let entities: EntityDefinition[] = [];

    try {
        const response = await getEntities({ url, apiKey, network }, platform, network);
        if (response.length === 0) {
            throw Error('No entities');
        }

        if (selectedConfig.entities && selectedConfig.entities.length) {
            configEntities = selectedConfig.entities.reduce((prev: EntityDefinition[], curr: string) => {
                const entity = response.find((item: EntityDefinition) => item.name === curr);
                if (entity) {
                    prev.push(entity);
                }
                return prev;
            }, []);
            responseEntities = response.filter((item: EntityDefinition) => selectedConfig.entities && !selectedConfig.entities.includes(item.name));
        }

        entities = [...configEntities, ...responseEntities];

        if (selectedConfig.hiddenEntities && selectedConfig.hiddenEntities.length) {
            entities = entities.filter((e: EntityDefinition) => selectedConfig.hiddenEntities && !selectedConfig.hiddenEntities.includes(e.name));
        }

        entities.forEach((e: EntityDefinition) => {
            if (typeof e.displayNamePlural === 'undefined' || e.displayNamePlural.length === 0) {
                e.displayNamePlural = e.displayName;
            }
        });

        await dispatch(setEntitiesAction(entities));
    } catch (e) {
        const message =
            e.message ||
            `Unable to load entity data for ${platform.charAt(0).toUpperCase() + platform.slice(1)} ${network.charAt(0).toUpperCase() + network.slice(1)}.`;
        throw Error(message);
    }
};

const loadAttributes = (query: string) => async (dispatch: any, state: any) => {
    const { platform, network, url, apiKey } = state().app.selectedConfig;
    const entities = state().app.entities;
    const attrs = { ...state().app.attributes };

    let injectedMetadata: any = {};
    if (state().app.selectedConfig.metadataOverrideUrl) {
        try {
            const metadata = await fetch(state().app.selectedConfig.metadataOverrideUrl).then(response => response.text());

            await hocon().then((instance) => {
                const cfg = new instance.Config(metadata);
                injectedMetadata = JSON.parse(cfg.toJSON());
                cfg.delete();
            });
        } catch (err) {
            // meh
        }
    }

    try {
        const localDate = getTimeStampFromLocal();
        const currentDate = Date.now();
        if (!attrs[network] || currentDate - localDate > CACHE_TIME) {
            const attrPromises = entities.map((entity: EntityDefinition) => fetchAttributes(platform, entity.name, network, { url, apiKey, network }));
            const attrObjsList = await Promise.all(attrPromises);

            if (!attrObjsList.length) {
                return;
            }

            try {
                attrObjsList.forEach((entity: any) => {
                    entity.attributes.forEach((attribute: any) => {
                        if (injectedMetadata['entities'][entity.entity]['attributes'][attribute.name]['value-map']) {
                            attribute.valueMap = {...injectedMetadata['entities'][entity.entity]['attributes'][attribute.name]['value-map']};
                        }
                    });
                });
            } catch (err) {
                // meh
            }

            const attrMap = [...attrObjsList].reduce((curr: any, next: any) => {
                curr[next.entity] = sortAttributes(next.attributes);
                return curr;
            }, {}) as {};

            attrs[platform] = {};
            attrs[platform][network] = { ...attrMap };

            await dispatch(setAttributesAction(attrs));
            saveAttributes(attrs, currentDate, CACHE_VERSION);
        }
    } catch (e) {
        const message = `Unable to load attribute data: ${e}.`;
        throw Error(message);
    }

    const { attributes, selectedEntity } = state().app;

    try {
        await dispatch(
            fetchInitEntityAction(platform, selectedEntity, network, { url, apiKey, network }, attributes[platform][network][selectedEntity], selectedEntity, query)
        );
    } catch (e) {
        const message = `Unable to load data: ${e}.`;
        throw Error(message);
    }
};

export const initLoad = (props: InitLoad) => async (dispatch: any, state: any) => {
    const { platform = '', network = '', entity = '', id = '', isQuery = false, history } = props;

    try {
        const isFullLoaded = state().app.isFullLoaded;

        if (isFullLoaded) {
            await dispatch(completeFullLoadAction(false));
        }

        const configs = state().app.configs;
        const config = configs.find((c: Config) => c.platform === platform && c.network === network);

        // Not valid params redirect to default path
        if (!config) {
            history.replace(defaultPath);
            return;
        }

        await dispatch(setConfigAction(config));
        await dispatch(loadEntities());

        let selectedEntity = state().app.entities.find((e: EntityDefinition) => e.name === entity)?.name;

        // Not valid entity change to first
        if (!selectedEntity) {
            selectedEntity = config.entities[0];
            history.replace(`/${config.platform}/${config.network}/${selectedEntity}`);
        }

        await dispatch(setEntityAction(selectedEntity));
        await validateCache(CACHE_VERSION);
        await dispatch(loadAttributes(isQuery ? id : ''));

        !isQuery && id && (await dispatch(loadModal(config.platform, config.network, id)));

        await dispatch(completeFullLoadAction(true));
    } catch (e) {
        if (e.message) {
            await dispatch(createMessageAction(e.message, true));
        }
    }
};

export const fetchAttributes = async (platform: string, entity: string, network: string, serverInfo: any) => {
    const attributes = await getAttributes(serverInfo, platform, network, entity).catch((err) => {
        throw err;
    });

    return { entity, attributes };
};

const getMainQuery = (attributeNames: string[], selectedFilters: Filter[], ordering: Sort[], aggregations: Aggregation[]) => {
    let query = addFields(blankQuery(), ...attributeNames);
    selectedFilters.forEach((filter: Filter) => {
        if (
            (filter.operator === ConseilOperator.BETWEEN || filter.operator === ConseilOperator.IN || filter.operator === 'notin') &&
            filter.values.length === 1
        ) {
            return true;
        }

        if (filter.operator !== ConseilOperator.ISNULL && filter.operator !== 'isnotnull' && (filter.values.length === 0 || filter.values[0].length === 0)) {
            return true;
        }

        let isInvert = false;
        let operator: any = filter.operator;
        if (filter.operator === 'isnotnull') {
            isInvert = true;
            operator = ConseilOperator.ISNULL;
        } else if (filter.operator === 'noteq') {
            operator = ConseilOperator.EQ;
            isInvert = true;
        } else if (filter.operator === 'notstartWith') {
            operator = ConseilOperator.STARTSWITH;
            isInvert = true;
        } else if (filter.operator === 'notendWith') {
            operator = ConseilOperator.ENDSWITH;
            isInvert = true;
        } else if (filter.operator === 'notin') {
            operator = ConseilOperator.IN;
            isInvert = true;
        }

        if (filter.operatorType === 'dateTime') {
            // HACK
            query = addPredicate(
                query,
                filter.name,
                operator,
                filter.values.map((v) => parseInt(v)),
                isInvert
            );
        } else {
            query = addPredicate(query, filter.name, operator, filter.values, isInvert);
        }
    });

    aggregations.forEach((agg: Aggregation | any) => {
        query = addAggregationFunction(query, agg.field, agg.function);
    });

    ordering.forEach((o) => {
        query = addOrdering(query, o.orderBy, o.order);
    });

    return query;
};

export const shareReport = () => async (dispatch: any, state: any) => {
    const { selectedEntity, columns, sort, selectedFilters, selectedConfig, aggregations } = state().app;
    const attributeNames = getAttributeNames(columns[selectedEntity]);
    let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity], aggregations[selectedEntity]);
    query = setLimit(query, 1000);
    const serializedQuery = JSON.stringify(query);
    const hostUrl = window.location.origin;
    const encodedUrl = base64url(serializedQuery);
    const shareLink = `${hostUrl}/${selectedConfig.platform}/${selectedConfig.network}/${selectedEntity}/query/${encodedUrl}`;
    const textField = document.createElement('textarea');
    textField.innerText = shareLink;
    document.body.appendChild(textField);
    if (isOS()) {
        const range = document.createRange();
        range.selectNodeContents(textField);
        const selection: any = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        textField.setSelectionRange(0, 999999);
    } else {
        textField.select();
    }
    document.execCommand('copy');
    textField.remove();
};

export const exportCsvData = () => async (dispatch: any, state: any) => {
    const { selectedEntity, columns, sort, selectedFilters, selectedConfig, aggregations } = state().app;
    const { platform, network, url, apiKey } = selectedConfig;
    const serverInfo = { url, apiKey, network };

    const attributeNames = getAttributeNames(columns[selectedEntity]);
    let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity], aggregations[selectedEntity]);
    query = ConseilQueryBuilder.setOutputType(query, ConseilOutput.csv);
    query = ConseilQueryBuilder.setLimit(query, 50000);

    const result: any = await executeEntityQuery(serverInfo, platform, network, selectedEntity, query);

    if (!result || result.length === 0) {
        dispatch(createMessageAction('Export failed, no results were returned.', true));
        return;
    }

    let blob = new Blob([result]);
    const winOpenBlob: any = window.navigator.msSaveOrOpenBlob || null;
    if (winOpenBlob) {
        window.navigator.msSaveBlob(blob, 'arronax-results.csv');
    } else {
        const a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'arronax-results.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

export const submitQuery = () => async (dispatch: any, state: any) => {
    dispatch(setLoadingAction(true));
    const { selectedEntity, selectedFilters, selectedConfig, columns, sort, aggregations } = state().app;
    const { platform, network, url, apiKey } = selectedConfig;
    const serverInfo = { url, apiKey, network };
    const attributeNames = getAttributeNames(columns[selectedEntity]);

    let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity], aggregations[selectedEntity]);
    query = setLimit(query, 1000);
    try {
        const items = await executeEntityQuery(serverInfo, platform, network, selectedEntity, query);
        await dispatch(setSubmitAction(selectedEntity, items, selectedFilters[selectedEntity].length));
        await dispatch(setQueryFilters(selectedEntity, query));
        dispatch(setLoadingAction(false));
    } catch (e) {
        const message = `Unable to submit query`;
        dispatch(createMessageAction(message, true));
        dispatch(setLoadingAction(false));
    }
};

export const changeTab = (entity: string) => async (dispatch: any, state: any) => {
    const { selectedConfig, attributes, items } = state().app;
    const { network, platform, url, apiKey } = selectedConfig;
    const serverInfo = { url, apiKey, network };

    try {
        if (!items[entity] || (items[entity] && items[entity].length === 0)) {
            dispatch(setLoadingAction(true));
            await dispatch(fetchInitEntityAction(platform, entity, network, serverInfo, attributes[platform][network][entity], '', ''));
            dispatch(setLoadingAction(false));
        }
    } catch (e) {
        const message = `Unable to change to tab ${entity}`;
        dispatch(createMessageAction(message, true));
        dispatch(setLoadingAction(false));
        throw Error(message);
    }

    dispatch(setTabAction(entity));
};

export const searchByIdThunk = (id: string | number) => async (dispatch: any, state: any) => {
    dispatch(setLoadingAction(true));
    const { selectedConfig, entities } = state().app;
    const { platform, network, url, apiKey } = selectedConfig;
    const serverInfo = { url, apiKey, network };

    try {
        const { entity, query } = TezosConseilClient.getEntityQueryForId(id);
        const items = await executeEntityQuery(serverInfo, platform, network, entity, query);
        if (items.length > 0) {
            await dispatch(changeTab(entity));
        } else {
            const searchedEntity = entities.find((item: any) => item.name === entity);
            dispatch(setLoadingAction(false));
            dispatch(createMessageAction(`The ${searchedEntity.displayName.toLowerCase()} was not found.`, true));
            return { entity: '', items: [], subItems: [] };
        }
        dispatch(setLoadingAction(false));
        await dispatch(setModalItems(platform, network, entity, id, items ));
        await dispatch(setModalOpen(true));
        return { entity, items };
    } catch (e) {
        if (e.message === 'Invalid id parameter') {
            dispatch(createMessageAction(`Invalid id format entered.`, true));
        } else {
            dispatch(createMessageAction('Unable to load an object for the id', true));
        }

        dispatch(setLoadingAction(false));
        return { entity: '', items: [], subItems: [] };
    }
};

export const getHightCardinalityValues = (attribute: string, prefix: string) => async (dispatch: any, state: any) => {
  const { selectedConfig, selectedEntity } = state().app;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey, network };
  try {
    return await getAttributeValuesForPrefix(serverInfo, platform, network, selectedEntity, attribute, prefix);
  } catch (e) {
    return [];
  }
};
