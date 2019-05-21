import {
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  TezosConseilClient,
  ConseilOperator,
  ConseilOutput,
  ConseilSortDirection
} from 'conseiljs';
const { executeEntityQuery } = ConseilDataClient;
const {
  blankQuery,
  addOrdering,
  addFields,
  setLimit,
  addPredicate,
} = ConseilQueryBuilder;
import {
  setAvailableValuesAction,
  setItemsAction,
  initDataAction,
  setLoadingAction,
  setNetworkAction,
  setColumnsAction,
  setAttributesAction,
  completeFullLoadAction,
  setFilterCountAction,
  setModalItemAction,
  setEntitiesAction,
  initEntityPropertiesAction
} from './actions';
import getConfigs from '../../utils/getconfig';
import { Config } from '../../types';

import { getTimeStampFromLocal, saveAttributes } from '../../utils/attributes';

const CACHE_TIME = 432000000; // 5*24*3600*1000

const configs: Config[] = getConfigs();
const { getAttributes, getAttributeValues, getEntities } = ConseilMetadataClient;

const getConfig = val => configs.find(conf => conf.network === val);

const getAttributeNames = attributes => attributes.map(attr => attr.name);

const nameList = {
  operations: [
    'timestamp',
    'block_level',
    'source',
    'destination',
    'amount',
    'kind',
  ],
  accounts: [
    'account_id',
    'manager',
    'delegate_value',
    'balance',
    'block_level',
    'counter',
  ],
  blocks: ['level', 'timestamp', 'hash', 'predecessor'],
};

const getInitialColumns = (entity, columns) => {
  if (!nameList[entity]) {
    return [...columns];
  }
  let newColumns = [];
  columns.forEach(c => {
    const index = nameList[entity].indexOf(c.name);
    if (index >= 0) {
      newColumns[index] = c;
    }
  });
  return newColumns;
};

export const fetchValues = (attribute: string) => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  const network = state().app.network;
  dispatch(setLoadingAction(true));
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };
  const values = await getAttributeValues(
    serverInfo,
    'tezos',
    network,
    selectedEntity,
    attribute
  );
  dispatch(setAvailableValuesAction(selectedEntity, attribute, values));
  dispatch(setLoadingAction(false));
};

export const changeNetwork = (network: string) => async (dispatch, state) => {
  const oldNetwork = state().app.network;
  if (oldNetwork === network) return;
  localStorage.setItem('timestamp', '0');
  await dispatch(initDataAction());
  await dispatch(setNetworkAction(network));
  await dispatch(initLoad());
};

export const resetColumns = () => async (dispatch, state) => {
  const { selectedEntity, attributes } = state().app;
  const newColumns = await getInitialColumns(selectedEntity, attributes[selectedEntity]);
  await dispatch(setColumnsAction(selectedEntity, newColumns));
};

export const fetchInitEntityAction = (
  platform,
  entity: string,
  network: string,
  serverInfo: any,
  attributes: object[]
) => async dispatch => {
  const columns = getInitialColumns(entity, attributes);
  const levelColumn =  columns.find(column => column.name === 'level' || column.name === 'block_level') || columns[0];
  const sort = {
    orderBy: levelColumn.name,
    order: ConseilSortDirection.DESC
  };
  const attributeNames = getAttributeNames(columns);

  let query = blankQuery();
  query = addFields(query, ...attributeNames);
  query = setLimit(query, 5000);
  query = addOrdering(
    query,
    sort.orderBy,
    sort.order
  );
  const items = await executeEntityQuery(
    serverInfo,
    platform,
    network,
    entity,
    query
  );
  await dispatch(initEntityPropertiesAction(entity, sort, columns, items));
};

export const initLoad = () => async (dispatch, state) => {
  const { network, platform } = state().app;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };
  const entities = await getEntities(serverInfo, platform, network);
  dispatch(setEntitiesAction(entities));
  const localDate = getTimeStampFromLocal();
  const currentDate = Date.now();
  if (currentDate - localDate > CACHE_TIME) {
    const attrPromises = entities.map(entity => dispatch(fetchAttributes(platform, entity.name, network, serverInfo)));
    await Promise.all(attrPromises);
    const { attributes } = state().app;
    saveAttributes(attributes, currentDate);
  }
  const { attributes } = state().app;
  const promises = entities.map(entity => dispatch(fetchInitEntityAction(platform, entity.name, network, serverInfo, attributes[entity.name])));
  await Promise.all(promises);
  dispatch(completeFullLoadAction(true));
};

export const fetchAttributes = (
  platform,
  entity,
  network,
  serverInfo
) => async dispatch => {
  const attributes = await getAttributes(serverInfo, platform, network, entity);
  await dispatch(setAttributesAction(entity, attributes));
};

const getMainQuery = (attributeNames, selectedFilters, sort) => {
  let query = blankQuery();
  query = addFields(query, ...attributeNames);
  selectedFilters.forEach(filter => {
    if ((filter.operator === ConseilOperator.BETWEEN || filter.operator === ConseilOperator.IN) && filter.values.length === 1) {
      return true;
    }
    let isInvert = false;
    let operator = filter.operator;
    if (filter.operator === 'isnotnull') {
      isInvert = true;
      operator = ConseilOperator.ISNULL;
    } else if (filter.operator === 'noteq') {
      operator = ConseilOperator.EQ;
      isInvert = true;
    }
    query = addPredicate(
      query,
      filter.name,
      operator,
      filter.values,
      isInvert
    );
  });
  // Add this to set ordering
  query = addOrdering(
    query,
    sort.orderBy,
    sort.order
  );

  return query;
}

export const exportCsvData = () => async (dispatch, state) => {
  const { selectedEntity, network, columns, sort, selectedFilters } = state().app;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };

  const attributeNames = getAttributeNames(columns[selectedEntity]);
  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity]);
  query = ConseilQueryBuilder.setOutputType(query, ConseilOutput.csv);

  const result: any = await executeEntityQuery(serverInfo, 'tezos', network, selectedEntity, query);
  let blob = new Blob([result]);
  if (window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, 'arronax-results.csv');
  } else  {
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
  const { selectedEntity, selectedFilters, network, columns, sort } = state().app;

  const config = getConfig(network);
  const attributeNames = getAttributeNames(columns[selectedEntity]);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };

  let query = getMainQuery(attributeNames, selectedFilters[selectedEntity], sort[selectedEntity]);
  query = setLimit(query, 5000);

  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    selectedEntity,
    query
  );
  await dispatch(setFilterCountAction(selectedFilters[selectedEntity].length));
  await dispatch(setItemsAction(selectedEntity, items));
  dispatch(setLoadingAction(false));
};

export const getItemByPrimaryKey = (primaryKey: string, value: string | number) => async (dispatch, state) => {
  dispatch(setLoadingAction(true));
  const entity = state().app.selectedEntity;
  const network = state().app.network;
  const sort = state().app.sort;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };

  let query = blankQuery();
  query = addPredicate(
    query,
    primaryKey,
    ConseilOperator.EQ,
    [value],
    false
  );
  query = addOrdering(
    query,
    sort[entity].orderBy,
    sort[entity].order
  );
  query = setLimit(query, 1);

  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    entity,
    query
  );
  await dispatch(setModalItemAction(items[0]));
  dispatch(setLoadingAction(false));
};
