
import base64url from 'base64url';

import {
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  ConseilOperator,
  ConseilOutput,
  ConseilSortDirection, EntityDefinition, AttributeDefinition
} from 'conseiljs';

import {
  setAvailableValuesAction,
  setItemsAction,
  initDataAction,
  setLoadingAction,
  setConfigAction,
  setColumnsAction,
  initAttributesAction,
  completeFullLoadAction,
  setFilterCountAction,
  setModalItemAction,
  setEntitiesAction,
  initEntityPropertiesAction,
  initFilterAction,
  setTabAction,
  initMainParamsAction
} from './actions';
import { createMessageAction } from '../message/actions';
import { Config, Sort, Filter } from '../../types';

import { getTimeStampFromLocal, saveAttributes, validateCache } from '../../utils/attributes';
import { defaultQueries, CARDINALITY_NUMBER } from '../../utils/defaultQueries';
import { getOperatorType } from '../../utils/general';

const { executeEntityQuery } = ConseilDataClient;
const {
  blankQuery,
  addOrdering,
  addFields,
  setLimit,
  addPredicate,
} = ConseilQueryBuilder;

const CACHE_TIME = 432000000; // 5*24*3600*1000

let InitProperties: any = {};

const { getAttributes, getAttributeValues, getEntities } = ConseilMetadataClient;

const getAttributeNames = (attributes: AttributeDefinition[]) => attributes.map(attr => attr.name);

export const fetchValues = (attribute: string) => async (dispatch, state) => {
  const { selectedEntity, selectedConfig } = state().app;
  const { network, platform, url, apiKey } = selectedConfig;
  dispatch(setLoadingAction(true));
  const serverInfo = { url, apiKey };
  const values = await getAttributeValues(
    serverInfo,
    platform,
    network,
    selectedEntity,
    attribute
  );
  dispatch(setAvailableValuesAction(selectedEntity, attribute, values));
  dispatch(setLoadingAction(false));
};

const initCardinalityValues = (
  platform: string,
  entity: string,
  network: string,
  attribute: string,
  serverInfo: any
) => async dispatch => {
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
export const changeNetwork = (config: Config) => async (dispatch, state) => {
  const oldConfig = state().app.selectedConfig;
  const isSame = oldConfig.network === config.network && oldConfig.platform === config.platform &&
    oldConfig.url === config.url && oldConfig.apiKey === config.apiKey;
  if (isSame) return;
  localStorage.setItem('timestamp', '0');
  await dispatch(initDataAction());
  await dispatch(setConfigAction(config));
  await dispatch(initLoad());
};

export const resetColumns = () => async (dispatch, state) => {
  const { selectedEntity } = state().app;
  const initProperty = InitProperties[selectedEntity];
  const columns = initProperty ? initProperty.columns : [];
  await dispatch(setColumnsAction(selectedEntity, columns));
};

export const resetFilters = () => async (dispatch, state) => {
  const { selectedEntity } = state().app;
  const initProperty = InitProperties[selectedEntity];
  const filters = initProperty ? initProperty.filters : [];
  await dispatch(initFilterAction(selectedEntity, filters));
};

export const fetchInitEntityAction = (
  platform: string,
  entity: string,
  network: string,
  serverInfo: any,
  attributes: AttributeDefinition[],
  urlEntity: string,
  urlQuery: string
) => async (dispatch: any) => {
  const defaultQuery = urlEntity === entity && urlQuery ? JSON.parse(base64url.decode(urlQuery)) : defaultQueries[entity];
  let columns: any[] = [];
  let sorts: Sort[];
  let filters: Filter[] = [];
  let cardinalityPromises: any[] = [];
  let query = blankQuery();
  const levelColumn = attributes.find(column => column.name === 'level' || column.name === 'block_level' || column.name === 'timestamp') || columns[0];

  if (defaultQuery) {
    const { fields, predicates, orderBy } = defaultQuery;
    query = defaultQuery;
    // initColumns
    if (fields.length > 0) {
      fields.forEach(field=> {
        const column = attributes.find(attr => attr.name === field);
        if (column) { columns.push(column); }
      });
    } else {
      columns = attributes;
    }

    if(orderBy.length > 0) {
      sorts = orderBy.map(o => { return { orderBy: o.field, order: o.direction } });
    } else {
      // adding the default sort
      sorts = [{
        orderBy: levelColumn.name,
        order: ConseilSortDirection.DESC
      }];
      query = addOrdering(query, sorts[0].orderBy, sorts[0].order);
    }
    // initFilters
    filters = predicates.map(predicate => {
      const selectedAttribute = attributes.find(attr => attr.name === predicate.field);
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

    // These values are used when reset columns or filters
    const initProperty = {
      columns, filters
    };
    InitProperties = {
      ...InitProperties,
      [entity]: initProperty
    };
  } else {
    const attributeNames = getAttributeNames(attributes);
    query = addFields(query, ...attributeNames);
    query = setLimit(query, 5000);

    if (levelColumn !== undefined) {
        sorts = [{ orderBy: levelColumn.name, order: ConseilSortDirection.DESC }];
        query = addOrdering(query, sorts[0].orderBy, sorts[0].order);
    }
  }

  const items = await executeEntityQuery(serverInfo, platform, network, entity, query)
            .catch(() => {
            dispatch(createMessageAction(`Unable to retrieve data for ${entity} request.`, true));
            return [];
        });
  
  await dispatch(initEntityPropertiesAction(entity, filters, sorts, columns, items));
  await Promise.all(cardinalityPromises);
};

export const initLoad = (environmentInfo?: string, query?: string) => async (dispatch, state) => {
  let urlEntity = '';
  if (environmentInfo && query) {
      const environmentName = environmentInfo.split('/')[0];
      const urlEntity = environmentInfo.split('/')[1];

      await dispatch(initMainParamsAction(environmentName, urlEntity));
  }
  const selectedConfig: Config = state().app.selectedConfig;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey };
  let message = '';

  let entities: any[] = await getEntities(serverInfo, platform, network).catch(err => {
    dispatch(createMessageAction(`Unable to load entity data for ${platform.charAt(0).toUpperCase() + platform.slice(1)} ${network.charAt(0).toUpperCase() + network.slice(1)}.`, true));
    return [];
  });
  if (entities.length === 0) {
    dispatch(completeFullLoadAction(true));
    return;
  }
  if (selectedConfig.entities && selectedConfig.entities.length > 0) {
      let filteredEntities: EntityDefinition[] = [];
      selectedConfig.entities.forEach(e => {
          if (e === 'rolls') { return; }
          let match = entities.find(i => i.name === e);
          if (!!match) { filteredEntities.push(match); }
      });
      entities.forEach(e => {
          if (e.name === 'rolls') { return; } // TODO
          if (!selectedConfig.entities.includes(e.name)) { filteredEntities.push(e); }
      });
      entities = filteredEntities;
  }

  entities.forEach(e => { if (e.displayNamePlural === undefined || e.displayNamePlural.length === 0) { e.displayNamePlural = e.displayName}}); // TODO: remove, use metadata when available

  dispatch(setEntitiesAction(entities));
  validateCache(2);
  const localDate = getTimeStampFromLocal();
  const currentDate = Date.now();
  if (currentDate - localDate > CACHE_TIME) {
    const attrPromises = entities.map(entity => fetchAttributes(platform, entity.name, network, serverInfo));
    const attrObjsList = await Promise.all(attrPromises).catch(err => {
      message = `There are some issues, when get the attributes of ${err}.`;
      dispatch(createMessageAction(message, true));
      return [];
    });
    if (attrObjsList.length > 0) {
      let attributes = {};
      attrObjsList.forEach(obj => {
        attributes = {
          ...attributes,
          [obj.entity]: obj.attributes
        }
      });
      await dispatch(initAttributesAction(attributes));
      saveAttributes(attributes, currentDate, 2);
    } else {
      dispatch(completeFullLoadAction(true));
      return;
    }
  }
  const { attributes, selectedEntity } = state().app;
  await dispatch(
    fetchInitEntityAction(platform, selectedEntity, network, serverInfo, attributes[selectedEntity], urlEntity, query)
  );
  dispatch(completeFullLoadAction(true));
};

export const fetchAttributes = async (
  platform: string,
  entity: string,
  network: string,
  serverInfo: any
) => {
  const attributes = await getAttributes(serverInfo, platform, network, entity).catch(err => {
    throw entity;
  });
  return {
    entity,
    attributes
  };
};

const getMainQuery = (attributeNames: string[], selectedFilters: Filter[], ordering: Sort[]) => {
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

    query = addPredicate(query, filter.name, operator, filter.values, isInvert);
  });

  query = addOrdering(query, ordering[0].orderBy, ordering[0].order);

  return query;
}

export const shareReport = () => async (dispatch, state) => {
  const { selectedEntity, columns, sort, selectedFilters, selectedConfig } = state().app;
  const attributeNames = getAttributeNames(columns[selectedEntity]);
  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity]);
  query = setLimit(query, 5000);
  const serializedQuery = JSON.stringify(query);
  const hostUrl = window.location.origin;
  const encodedUrl = base64url(serializedQuery);
  const shareLink = `${hostUrl}?e=${encodeURIComponent(selectedConfig.displayName)}/${encodeURIComponent(selectedEntity)}&q=${encodedUrl}`;
  const textField = document.createElement('textarea');
  textField.innerText = shareLink;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
}

export const exportCsvData = () => async (dispatch, state) => {
  const { selectedEntity, columns, sort, selectedFilters, selectedConfig } = state().app;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey };

  const attributeNames = getAttributeNames(columns[selectedEntity]);
  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity]);
  query = ConseilQueryBuilder.setOutputType(query, ConseilOutput.csv);
  query = ConseilQueryBuilder.setLimit(query, 50000);

  const result: any = await executeEntityQuery(serverInfo, platform, network, selectedEntity, query);
  let blob = new Blob([result]);
  if (window.navigator.msSaveOrOpenBlob) {
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

export const submitQuery = () => async (dispatch, state) => {
  dispatch(setLoadingAction(true));
  const { selectedEntity, selectedFilters, selectedConfig, columns, sort } = state().app;
  const { platform, network, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey };
  const attributeNames = getAttributeNames(columns[selectedEntity]);

  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity]);
  query = setLimit(query, 5000);
  const items = await executeEntityQuery(serverInfo, platform, network, selectedEntity, query);
  await dispatch(setFilterCountAction(selectedFilters[selectedEntity].length));
  await dispatch(setItemsAction(selectedEntity, items));
  dispatch(setLoadingAction(false));
};

export const getItemByPrimaryKey = (entity: string, primaryKey: string, value: string | number) => async (dispatch: any, state: any) => {
  dispatch(setLoadingAction(true));
  const { network, platform, url, apiKey } = state().app.selectedConfig;
  const serverInfo = { url, apiKey };

  let query = blankQuery();
  query = addPredicate(query, primaryKey, ConseilOperator.EQ, [value], false);
  query = setLimit(query, 1);

  const items = await executeEntityQuery(serverInfo, platform, network, entity, query);

  await dispatch(setModalItemAction(items[0]));
  dispatch(setLoadingAction(false));
};

export const changeTab = (entity: string) => async (dispatch, state) => {
  const { selectedConfig, attributes, items } = state().app;
  const { network, platform, url, apiKey } = selectedConfig;
  const serverInfo = { url, apiKey };

  if(!items[entity] || (items[entity] && items[entity].length === 0)) {
    dispatch(setLoadingAction(true));
    await dispatch(fetchInitEntityAction(platform, entity, network, serverInfo, attributes[entity], '', ''));
    dispatch(setLoadingAction(false));
  }
  dispatch(setTabAction(entity));
};
