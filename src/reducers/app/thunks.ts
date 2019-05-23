import {
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  TezosConseilClient,
  ConseilOperator,
  ConseilOutput
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
  setModalItemAction
} from './actions';
import getConfigs from '../../utils/getconfig';
import { Config } from '../../types';

import { getTimeStampFromLocal, saveAttributes } from '../../utils/attributes';

const CACHE_TIME = 432000000; // 5*24*3600*1000

const configs: Config[] = getConfigs();
const { getAttributes, getAttributeValues } = ConseilMetadataClient;

const getConfig = val => {
  return configs.find(conf => conf.network === val);
};

const getAttributeNames = attributes => {
  let attr = [];
  attributes.forEach(attribs => {
    attr.push(attribs.name);
  });
  return attr;
};

const nameList = {
    operations: ['timestamp', 'block_level', 'kind', 'source', 'destination', 'amount', 'fee', 'operation_group_hash'],
    accounts: ['account_id', 'manager', 'delegate_value', 'balance'],
    blocks: ['level', 'timestamp', 'hash', 'baker', 'meta_cycle']
};

const getInitialColumns = (entity, columns) => {
  let newColumns = [];
  columns.forEach(c => {
    const index = nameList[entity].indexOf(c.name);
    if (index >= 0) {
      newColumns[index] = c;
    }
  });
  return newColumns;
};

export const setItems = (type, items) => {
  return dispatch => {
    dispatch(setItemsAction(type, items));
  };
};

export const setColumns = (type, items) => {
  return dispatch => {
    dispatch(setColumnsAction(type, items));
  };
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
  dispatch(initDataAction());
  dispatch(setNetworkAction(network));
  await dispatch(initLoad());
};

export const resetColumns = () => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  const attributes = state().app.attributes;
  const newColumns = await getInitialColumns(selectedEntity, attributes[selectedEntity]);
  await dispatch(setColumns(selectedEntity, newColumns));
};

export const fetchItemsAction = (
  entity: string,
  network: string,
  serverInfo: any
) => async (dispatch, state) => {
  const attributes = state().app.attributes;
  const sort = state().app.sort;
  const attributeNames = getAttributeNames(attributes[entity]);
  const columns = await getInitialColumns(entity, attributes[entity]);
  await dispatch(setColumns(entity, columns));
  let query = blankQuery();
  query = addFields(query, ...attributeNames);
  query = setLimit(query, 5000);
  query = addOrdering(
    query,
    sort[entity].orderBy,
    sort[entity].order
  );
  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    entity,
    query
  );
  await dispatch(setItemsAction(entity, items));
};

export const initLoad = () => async (dispatch, state) => {
  const network = state().app.network;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };
  const localDate = getTimeStampFromLocal();
  const currentDate = Date.now();
  if (currentDate - localDate > CACHE_TIME) {
    await dispatch(loadAttributes(network, serverInfo));
    const attributes = state().app.attributes;
    saveAttributes(attributes, currentDate);
  }
  await dispatch(fetchItemsAction('blocks', network, serverInfo));
  await dispatch(fetchItemsAction('operations', network, serverInfo));
  await dispatch(fetchItemsAction('accounts', network, serverInfo));
  dispatch(completeFullLoadAction(true));
};


export const fetchAttributes = (
  entity,
  network,
  serverInfo
) => async dispatch => {
  const attributes = await getAttributes(serverInfo, 'tezos', network, entity);
  dispatch(setAttributesAction(entity, attributes));
};

export const loadAttributes = (network, serverInfo) => async dispatch => {
  await dispatch(fetchAttributes('blocks', network, serverInfo));
  await dispatch(fetchAttributes('operations', network, serverInfo));
  await dispatch(fetchAttributes('accounts', network, serverInfo));
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
  const selectedEntity = state().app.selectedEntity;
  const selectedFilters = state().app.selectedFilters[selectedEntity];
  const network = state().app.network;
  const config = getConfig(network);
  const attributes = state().app.columns;
  const sort = state().app.sort;
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };

  const attributeNames = getAttributeNames(attributes[selectedEntity]);
  let query = getMainQuery(attributeNames, selectedFilters, sort[selectedEntity]);
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
  const entity = state().app.selectedEntity;
  const selectedFilters = state().app.selectedFilters[entity];
  const network = state().app.network;
  const attributes = state().app.columns;
  const sort = state().app.sort;
  const config = getConfig(network);
  const attributeNames = getAttributeNames(attributes[entity]);
  const serverInfo = {
    url: config.url,
    apiKey: config.apiKey,
  };

  let query = getMainQuery(attributeNames, selectedFilters, sort[entity]);
  query = setLimit(query, 5000);

  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    entity,
    query
  );
  await dispatch(setFilterCountAction(selectedFilters.length));
  await dispatch(setItemsAction(entity, items));
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
