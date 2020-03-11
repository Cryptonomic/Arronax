
import base64url from 'base64url';

import {
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  ConseilOperator,
  ConseilOutput,
  ConseilSortDirection,
  AttributeDefinition,
  AttrbuteDataType,
  TezosConseilClient
} from 'conseiljs';

import {
  setAvailableValuesAction,
  initDataAction,
  setLoadingAction,
  setConfigAction,
  setColumnsAction,
  initAttributesAction,
  completeFullLoadAction,
  setModalItemAction,
  setEntitiesAction,
  initEntityPropertiesAction,
  initFilterAction,
  setTabAction,
  initMainParamsAction,
  setSubmitAction,
  setAggregationAction,
  initItemsAction
} from './actions';
import { createMessageAction } from '../message/actions';
import { Config, Sort, Filter, Aggregation } from '../../types';

import { getTimeStampFromLocal, saveAttributes, validateCache } from '../../utils/attributes';
import { defaultQueries, CARDINALITY_NUMBER } from '../../utils/defaultQueries';
import { getOperatorType, sortAttributes, isOS } from '../../utils/general';

const { executeEntityQuery } = ConseilDataClient;
const {
  blankQuery,
  addOrdering,
  addFields,
  setLimit,
  addPredicate,
  addAggregationFunction
} = ConseilQueryBuilder;

const CACHE_TIME = 432000000; // 5*24*3600*1000

let InitProperties: any = {};

const { getAttributes, getAttributeValues, getEntities, getAttributeValuesForPrefix } = ConseilMetadataClient;

const getAttributeNames = (attributes: AttributeDefinition[]) => attributes.map(attr => attr.name);

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
  const values = await getAttributeValues(
    serverInfo,
    platform,
    network,
    entity,
    attribute
  );
  await dispatch(setAvailableValuesAction(entity, attribute, values));
};

// TODO need to modify
export const changeNetwork = (config: Config) => async (dispatch: any, state: any) => {
  const oldConfig = state().app.selectedConfig;
  const isSame = oldConfig.network === config.network && oldConfig.platform === config.platform &&
    oldConfig.url === config.url && oldConfig.apiKey === config.apiKey;
  
    if (isSame) return;
  
  if(oldConfig.platform === config.platform) {
    await dispatch(initItemsAction());
    await dispatch(setConfigAction(config));
    await dispatch(initLoadByNetwork());
  } else {
    localStorage.setItem('timestamp', '0');
    await dispatch(initDataAction());
    await dispatch(setConfigAction(config));
    await dispatch(initLoad());
  }
};

function clearSortAndAggregations(columns: AttributeDefinition[], sort: Sort, aggregations: Aggregation[]) {
  const sortedColumn = columns.find(col => col.name === sort.orderBy);
  let newSort = { ...sort};
  if (!sortedColumn) {
    const levelColumn = columns.find(column => column.name === 'level' || column.name === 'block_level' || column.name === 'timestamp') || columns[0];
    newSort = {
      orderBy: levelColumn.name,
      order: ConseilSortDirection.DESC
    };
  }
  const newAggs: any = [];
  aggregations.forEach(agg => {
    const colIndex = columns.findIndex(col => col.name === agg.field);
    if (colIndex > -1) {
      newAggs.push(agg);
      if (agg.field === newSort.orderBy) {
        newSort = {
          ...newSort,
          orderBy: `${agg.function}_${newSort.orderBy}`
        };
      }
    } 
  });

  return {
    sorts: [newSort],
    aggs: newAggs
  };
}

export const setAggregationsThunk = (aggregations: Aggregation[]) => async (dispatch: any, state: any) => {
  const { selectedEntity, sort, columns } = state().app;
  let selectedSorts = sort[selectedEntity];
  const selectedColumns = columns[selectedEntity];
  const { sorts, aggs } = clearSortAndAggregations(selectedColumns, selectedSorts, aggregations);
  const sortColumn = selectedColumns.find((col: any) => col.name === selectedSorts[0].orderBy);
  const sortAgg = aggregations.find(agg => (selectedSorts[0].orderBy === `${agg.function}_${agg.field}`) || (selectedSorts[0].orderBy === agg.field));
  if ((!sortColumn && !sortAgg) || (sortColumn && sortAgg) ) {
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
) => async (dispatch: any) => {
  let defaultQuery: any = (urlEntity === entity && urlQuery) ? JSON.parse(base64url.decode(urlQuery)) : defaultQueries[entity];
  defaultQuery = {...ConseilQueryBuilder.blankQuery(), ...defaultQuery};
  let columns: any[] = [];
  let sorts: Sort[];
  let filters: Filter[] = [];
  let aggregations: Aggregation[] = [];
  let cardinalityPromises: any[] = [];
  let query: any = blankQuery();
  const sortedAttributes = sortAttributes(attributes);
  const levelColumn = attributes.find(column => column.name === 'level' || column.name === 'block_level' || column.name === 'timestamp') || sortedAttributes[0];

  if (defaultQuery) {
    const { fields, predicates, orderBy } = defaultQuery;
    query = defaultQuery;
    // initColumns
    if (fields.length > 0) {
      fields.forEach((field: any)=> {
        const column = attributes.find(attr => attr.name === field);
        if (column) { columns.push(column); }
      });
    } else {
      columns = [...sortedAttributes];
    }

    if (orderBy.length > 0) {
      sorts = orderBy.map((o: any) => { return { orderBy: o.field, order: o.direction } });
    } else {
      // adding the default sort
      sorts = [{
        orderBy: levelColumn.name,
        order: ConseilSortDirection.DESC
      }];
      query = addOrdering(query, sorts[0].orderBy, sorts[0].order);
    }
    // initFilters
    filters = predicates.map((predicate: any) => {
      const selectedAttribute: any = attributes.find(attr => attr.name === predicate.field);
      const isLowCardinality = selectedAttribute.cardinality !== undefined && selectedAttribute.cardinality < CARDINALITY_NUMBER;
      if (isLowCardinality) {
        cardinalityPromises.push(
          dispatch(initCardinalityValues(platform, entity, network, selectedAttribute.name, serverInfo))
        );
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
        isLowCardinality
      };
    });

    predicates.forEach((predicate: any) => {
        const selectedAttribute: any = attributes.find(attr => attr.name === predicate.field);
        if (selectedAttribute.dataType === AttrbuteDataType.DATETIME){
            for (let i = 0; i < predicate.set.length; i++) {
                if (Number(predicate.set[i]) < 0) {
                    predicate.set[i] = (new Date()).getTime() + predicate.set[i];
                }
            }
        }
    });

    if (!!query.aggregation && query.aggregation.length > 0) {
      aggregations = query.aggregation.map((agg: any) => {
        const selectedAttribute: any = attributes.find(attr => attr.name === agg.field);
        const type = getOperatorType(selectedAttribute.dataType);
        return {...agg, type};
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
    dispatch(createMessageAction(`Unable to retrieve data for ${entity} request.`, true)); // TODO: use metadata
    return [];
  });
  
  await dispatch(initEntityPropertiesAction(entity, filters, sorts, columns, items, aggregations));
  await Promise.all(cardinalityPromises);
};

export const initLoadByNetwork = () => async (dispatch: any, state: any) => {
  dispatch(setLoadingAction(true));
  const { selectedConfig, selectedEntity } = state().app;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey, network };

  let entities: any[] = await getEntities(serverInfo, platform, network)
    .catch(() => {
      const message = `Unable to load entity data for ${platform.charAt(0).toUpperCase() + platform.slice(1)} ${network.charAt(0).toUpperCase() + network.slice(1)}.`
      dispatch(createMessageAction(message, true)); // TODO: use metadata
      return [];
  });

  if (entities.length === 0) {
    dispatch(setLoadingAction(false));
    return;
  }

  if (selectedConfig.entities && selectedConfig.entities.length > 0) {
    entities = [
      ...selectedConfig.entities.map((name: any) => entities.find(item => item.name === name)),
      ...entities.filter(item => !selectedConfig.entities.includes(item.name))
    ];
}

  let isSelectedEntity = false;

  entities.forEach(e => {
    if (e.name === selectedEntity && !isSelectedEntity) {
      isSelectedEntity = true;
    }
    if (typeof e.displayNamePlural === 'undefined' || e.displayNamePlural.length === 0) {
      e.displayNamePlural = e.displayName;
    }
  }); // TODO: remove, use metadata when available

  dispatch(setEntitiesAction(entities, !isSelectedEntity));
  validateCache(2);
  
  const attrPromises = entities.map(entity => fetchAttributes(platform, entity.name, network, serverInfo));
  const attrObjsList = await Promise.all(attrPromises)
    .catch(err => {
      const message = `Unable to load attribute data: ${err}.`
      dispatch(createMessageAction(message, true));
      return [];
  });
  if (attrObjsList.length > 0) {
    const attrMap = [...attrObjsList].reduce((curr: any, next) => {
      curr[next.entity] = sortAttributes(next.attributes);
      return curr;
    }, {});
    await dispatch(initAttributesAction(attrMap));
    const currentDate = Date.now();
    saveAttributes(attrMap, currentDate, 2);
  } else {
    dispatch(setLoadingAction(false));
    return;
  }

  if (isSelectedEntity) {
    dispatch(submitQuery());
  } else {
    const { attributes } = state().app;
    const newEntity = entities[0].name;
    await dispatch(
      fetchInitEntityAction(platform, newEntity, network, serverInfo, attributes[newEntity], '', '')
    );
    dispatch(setLoadingAction(false));
  }
};

export const initLoad = (platformParam = '', networkParam = '', entityParam = '', idParam = '', isQuery = false) => async (dispatch: any, state: any) => {
  // redirect, changePath, openModal, modalItems
  const responseRedirect = [true, false];
  const responseChangePath = [false, true];
  const responseOpenModal: [boolean, boolean, Record<string, object[] | string>] = [false, false, { items: [], entity: '' }];
  const responseWithNoAction = [false, false];
  const query = isQuery ? idParam : '';
  const configs = state().app.configs;
  const configFromParams = configs.find((c: Config) => c.platform === platformParam && c.network === networkParam);

  // Not valid params redirect to default path
  if (!configFromParams && platformParam && networkParam) return responseRedirect;

  const selectedConfig: Config | any = configFromParams || state().app.selectedConfig;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey, network };
  let entities: any[] = [];

  try {
    entities = await getEntities(serverInfo, platform, network);
  } catch (e) {
    const message = `Unable to load entity data for ${platform.charAt(0).toUpperCase() + platform.slice(1)} ${network.charAt(0).toUpperCase() + network.slice(1)}.`
    await dispatch(createMessageAction(message, true));
    return responseWithNoAction;
  }

  if (entities.length === 0) {
    await dispatch(completeFullLoadAction(true));
    return responseWithNoAction;
  }

  if (selectedConfig.entities && selectedConfig.entities.length > 0) {
      entities = [
        ...selectedConfig.entities.map((name: any) => entities.find(item => item.name === name)),
        ...entities.filter(item => !selectedConfig.entities.includes(item.name))
      ];
  }

  entities.forEach(e => { 
    if (typeof e.displayNamePlural === 'undefined' || e.displayNamePlural.length === 0) { 
      e.displayNamePlural = e.displayName
    }
  });

  const entityFromParam = entities.find((e: any) => e.name === entityParam);

  // Not valid param redirect to default path
  if (!entityFromParam && entityParam) return responseRedirect

  await dispatch(setEntitiesAction(entities));
  await dispatch(initMainParamsAction(platform, network, entityParam || entities[0].name));
  validateCache(2);

  try {
    const localDate = getTimeStampFromLocal();
    const currentDate = Date.now();
    if (currentDate - localDate > CACHE_TIME) {
      const attrPromises = entities.map(entity => fetchAttributes(platform, entity.name, network, serverInfo));
      const attrObjsList = await Promise.all(attrPromises);

      if (attrObjsList.length > 0) {
        const attrMap = [...attrObjsList].reduce((curr: any, next) => {
          curr[next.entity] = sortAttributes(next.attributes);
          return curr;
        }, {});
        await dispatch(initAttributesAction(attrMap));
        saveAttributes(attrMap, currentDate, 2);
      } else {
        await dispatch(completeFullLoadAction(true));
        return responseWithNoAction;
      }
    }
  } catch (e) {
    const message = `Unable to load attribute data: ${e}.`
    await dispatch(createMessageAction(message, true));
    return responseWithNoAction;
  }

  const { attributes, selectedEntity } = state().app;

  try {
    await dispatch(
      fetchInitEntityAction(platform, selectedEntity, network, serverInfo, attributes[selectedEntity], entityParam, query)
    );
  } catch (e) {
    const message = `Unable to load data: ${e}.`
    await dispatch(createMessageAction(message, true));
    return responseRedirect;
  }

  if (isQuery || !idParam) {
    await dispatch(completeFullLoadAction(true));
    return responseWithNoAction
  };

  try {
    const { entity, query } = TezosConseilClient.getEntityQueryForId(idParam);
    const items = await executeEntityQuery(serverInfo, platform, network, entity, query);
    responseOpenModal[2] = { ...responseOpenModal[2], entity, items }
  } catch (e) {
    if (e.message === 'Invalid id parameter') {
      dispatch(createMessageAction(`Invalid id format entered.`, true));
    } else {
      dispatch(createMessageAction('Unable to load an object for the id', true));
    }
  }

  await dispatch(completeFullLoadAction(true));
  
  if (state().message.isError) return responseChangePath;
  return responseOpenModal;
};

export const fetchAttributes = async (platform: string, entity: string, network: string, serverInfo: any) => {
  const attributes = await getAttributes(serverInfo, platform, network, entity).catch(err => {
    throw entity;
  });
  return { entity, attributes };
};

const getMainQuery = (attributeNames: string[], selectedFilters: Filter[], ordering: Sort[], aggregations: Aggregation[]) => {
  let query = addFields(blankQuery(), ...attributeNames);
  selectedFilters.forEach((filter: Filter) => {
    if ((filter.operator === ConseilOperator.BETWEEN || filter.operator === ConseilOperator.IN || filter.operator === 'notin') && filter.values.length === 1) {
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

    if (filter.operatorType === 'dateTime') { // HACK
        query = addPredicate(query, filter.name, operator, filter.values.map(v => parseInt(v)), isInvert);
    } else {
        query = addPredicate(query, filter.name, operator, filter.values, isInvert);
    }
  });

  aggregations.forEach((agg: Aggregation | any) => {
    query = addAggregationFunction(query, agg.field, agg.function);
  });  

  ordering.forEach(o => {
    query = addOrdering(query, o.orderBy, o.order);
  });

  return query;
}

export const shareReport = () => async (dispatch: any, state: any) => {
  const { selectedEntity, columns, sort, selectedFilters, selectedConfig, aggregations } = state().app;
  const attributeNames = getAttributeNames(columns[selectedEntity]);
  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity], aggregations[selectedEntity]);
  query = setLimit(query, 1000);
  const serializedQuery = JSON.stringify(query);
  const hostUrl = window.location.origin;
  const encodedUrl = base64url(serializedQuery);
  const shareLink = `${hostUrl}?e=${encodeURIComponent(selectedConfig.displayName)}/${encodeURIComponent(selectedEntity)}&q=${encodedUrl}`;
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
}

export const exportCsvData = () => async (dispatch: any, state: any) => {
  const { selectedEntity, columns, sort, selectedFilters, selectedConfig, aggregations } = state().app;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey, network };

  const attributeNames = getAttributeNames(columns[selectedEntity]);
  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity], aggregations[selectedEntity]);
  query = ConseilQueryBuilder.setOutputType(query, ConseilOutput.csv);
  query = ConseilQueryBuilder.setLimit(query, 50000);

  const result: any = await executeEntityQuery(serverInfo, platform, network, selectedEntity, query);
  let blob = new Blob([result]);
  const winOpenBlob: any = window.navigator.msSaveOrOpenBlob || null;
  if (winOpenBlob) {
    window.navigator.msSaveBlob(blob, 'arronax-results.csv');
  } else {
    const a = window.document.createElement("a");
    a.href = window.URL.createObjectURL(blob);
    a.download = 'arronax-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

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
    dispatch(setLoadingAction(false));
  } catch (e) {
    const message = `Unable to submit query`;
    dispatch(createMessageAction(message, true));
    dispatch(setLoadingAction(false));
  }
};

export const getItemByPrimaryKey = (entity: string, primaryKey: string, value: string | number) => async (dispatch: any, state: any) => {
  dispatch(setLoadingAction(true));
  const { network, platform, url, apiKey } = state().app.selectedConfig;
  const serverInfo = { url, apiKey, network };

  let query = blankQuery();
  let query_operations = null;

  query = addPredicate(query, primaryKey, ConseilOperator.EQ, [value], false);
  const s = String(value);
  if (s.startsWith('o')) {
    query = setLimit(query, 1000);
  } else {
    query = setLimit(query, 1);
  }

  if (entity === 'blocks') {
    query_operations = blankQuery();
    query_operations = addPredicate(query_operations, 'block_hash', ConseilOperator.EQ, [value], false);
  }

  const items = await executeEntityQuery(serverInfo, platform, network, entity, query);
  const operations = query_operations ? await executeEntityQuery(serverInfo, platform, network, 'operations', query_operations) : [];

  await dispatch(setModalItemAction(items, operations));
  dispatch(setLoadingAction(false));
};

export const changeTab = (entity: string) => async (dispatch: any, state: any) => {
  const { selectedConfig, attributes, items } = state().app;
  const { network, platform, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey, network };

  try {
    if(!items[entity] || (items[entity] && items[entity].length === 0)) {
      dispatch(setLoadingAction(true));
      await dispatch(fetchInitEntityAction(platform, entity, network, serverInfo, attributes[entity], '', ''));
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
  let query_operations = null;
  try {
    const { entity, query } = TezosConseilClient.getEntityQueryForId(id);
    if (entity === 'blocks') {
      query_operations = blankQuery();
      query_operations = addPredicate(query_operations, 'block_hash', ConseilOperator.EQ, [id], false);
    }
    const items = await executeEntityQuery(serverInfo, platform, network, entity, query);
    const operations = query_operations ? await executeEntityQuery(serverInfo, platform, network, 'operations', query_operations) : [];
    if (items.length > 0) {
      await dispatch(changeTab(entity));
    } else {
      const searchedEntity = entities.find((item: any) => item.name === entity);
      dispatch(createMessageAction(`The ${searchedEntity.displayName.toLowerCase()} was not found.`, true));
    }
    dispatch(setLoadingAction(false));
    return { entity, items, subItems: operations };
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
  return await getAttributeValuesForPrefix(serverInfo, platform, network, selectedEntity, attribute, prefix);
};
