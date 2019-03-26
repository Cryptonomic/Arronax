import {
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  ConseilSortDirection,
  TezosConseilClient
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
  completeFullLoadAction
} from './actions';
import getConfigs from '../../utils/getconfig';

import { getBlockHeadFromLocal, saveAttributes } from '../../utils/attributes';

let currentAttributesRefreshInterval = null;
const SYNC_LEVEL = 57600;
const SYNC_TIME = 10;

const configs = getConfigs();
const { getAttributes, getAttributeValues } = ConseilMetadataClient;

const getConfig = val => {
  return configs.find(conf => conf.value === val);
};

const getAttributeNames = (attributes) => {
  let attr = [];
  attributes.forEach(attribs => {
    attr.push(attribs.name);
  });
  return attr;
};

const getInitialColumns = (entity, columns) => {
  if (entity !== 'blocks') {
    const newColumns = columns.slice(0, 6);
    return newColumns;
  } else {
    const newColumns = columns.reduce((acc, element) => {
      if (element.name === 'level') {
        acc[0] = element;
      } else if (element.name === 'timestamp') {
        acc[1] = element;
      } else if (element.name === 'hash') {
        acc[2] = element;
      } else if (element.name === 'predecessor') {
        acc[3] = element;
      }
      return [...acc];
    }, []);
    return newColumns;
  }
};

const convertValues = val => {
  let newVal = [];
  val.forEach(val => {
    if (val !== null) {
      const item = val.replace(/\s+/g, '_').toLowerCase();
      newVal.push(item);
    } else if (val === null) {
      newVal.push(null);
    }
  });
  return newVal[0];
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

export const submitQuery = () => async (dispatch, state) => {
  dispatch(setLoadingAction(true));
  const entity = state().app.selectedEntity;
  const selectedFilters = state().app.selectedFilters[entity];
  const network = state().app.network;
  const attributes = state().app.columns;
  const selectedValues = state().app.selectedValues;
  const config = getConfig(network);
  const limit = state().app.rowCount;
  const attributeNames = getAttributeNames(attributes[entity]);
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  const lowCardinalities = [
    'spendable',
    'delegate_setable',
    'kind',
    'spendable',
    'delegatable',
    'status',
  ];
  let valuesToConvert = [];
  let finalValues = [];
  selectedValues.forEach(value => {
    if (entity !== 'blocks') {
      const key = Object.keys(value).toString();
      if (lowCardinalities.includes(key)) {
        valuesToConvert.push(Object.values(value).toString());
        // Convert values with low cardinalities from their display values (eg: Seed Nonce Revelation)
        // into the required values for interacting with ConseilJS (eg: seed_nonce_revelation)
        const newValues = convertValues(valuesToConvert);
        finalValues.push({ [key]: newValues });
      } else {
        finalValues.push(value);
      }
    } else {
      finalValues.push(value);
    }
  });
  let query = blankQuery();
  query = addFields(query, ...attributeNames);
  selectedFilters.forEach(filter => {
    finalValues.forEach(value => {
      const valueKeys = Object.keys(value).toString();
      const values = Object.values(value).toString();
      if (filter.name === valueKeys && values.indexOf('-') !== -1) {
        // Find corresponding filters and their values and add them to the query
        // Find between values (eg: 12000-1400) and split them at the -
        // This returns ["1200", "1400"] which is the correct way to interact with ConseilJS with between values
        const newValues = values.split('-');
        return (query = addPredicate(
          query,
          filter.name,
          filter.operator.toLowerCase(),
          newValues,
          false
        ));
      } else if (filter.name === valueKeys) {
        // Find corresponding filters and their values and add them to the query
        return (query = addPredicate(
          query,
          filter.name,
          filter.operator.toLowerCase(),
          Object.values(value),
          false
        ));
      }
    });
  });
  query = setLimit(query, limit);
  // Add this to set ordering
  query = addOrdering(
    query,
    attributeNames.includes('block_level') ? 'block_level' : 'level',
    ConseilSortDirection.ASC
  );
  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    entity,
    query
  );
  await dispatch(setItemsAction(entity, items));
  dispatch(setLoadingAction(false));
};

export const fetchValues = (attribute: string) => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  const network = state().app.network;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  const values = await getAttributeValues(
    serverInfo,
    'tezos',
    network,
    selectedEntity,
    attribute
  );
  const newValues = values.map(newValue => {
    return { [attribute]: newValue };
  });
  dispatch(setAvailableValuesAction(newValues));
};

export const changeNetwork = (network: string) => async (dispatch, state) => {
  const oldNetwork = state().app.network;
  if (oldNetwork === network) return;
  dispatch(initDataAction());
  dispatch(setNetworkAction(network));
  await dispatch(initLoad());
};

export const fetchColumns = (columns, entity) => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  const newColumns = await getInitialColumns(selectedEntity, columns);
  columns[selectedEntity] = newColumns;
  await dispatch(setColumns(selectedEntity, newColumns));
};

export const fetchItemsAction = (entity: string, network: string, serverInfo: any) => async (dispatch, state) => {
  const attributes = state().app.attributes;
  const attributeNames = getAttributeNames(attributes[entity]);
  const columns = await getInitialColumns(entity, attributes[entity]);
  await dispatch(setColumns(entity, columns));
  let query = blankQuery();
  query = addFields(query, ...attributeNames);
  query = setLimit(query, 100);
  query = addOrdering(
    query,
    attributeNames.includes('block_level') ? 'block_level' : 'level',
    ConseilSortDirection.DESC
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
    apiKey: config.key,
  };
  const attributes = state().app.attributes;
  if (attributes['blocks'].length === 0) {
    const blockHead: any = await TezosConseilClient.getBlockHead(serverInfo, network);
    await dispatch(loadAttributes(network, serverInfo));
    saveAttributes(attributes, blockHead[0].level);
  }
  dispatch(automaticAttributesRefresh());
  await dispatch(fetchItemsAction('blocks', network, serverInfo));
  await dispatch(fetchItemsAction('operations', network, serverInfo));
  await dispatch(fetchItemsAction('accounts', network, serverInfo));
  dispatch(completeFullLoadAction(true));
}

export const clearAutomaticAttributesRefresh = () => {
  clearInterval(currentAttributesRefreshInterval);
}

export const automaticAttributesRefresh = () => (dispatch) =>{
  const oneSecond = 1000; // milliseconds
  const oneMinute = 60 * oneSecond;
  const REFRESH_INTERVAL = SYNC_TIME * oneMinute;

  if (currentAttributesRefreshInterval) {
    clearAutomaticAttributesRefresh();
  }

  currentAttributesRefreshInterval = setInterval(
    () => dispatch(syncAttributes()),
    REFRESH_INTERVAL
  );
}

export const fetchAttributes = (entity, network, serverInfo) => async (dispatch) => {
  const attributes = await getAttributes(
    serverInfo,
    'tezos',
    network,
    entity
  );
  dispatch(setAttributesAction(entity, attributes));
};

export const loadAttributes = (network, serverInfo) => async (dispatch) => {
  await dispatch(fetchAttributes('blocks', network, serverInfo));
  await dispatch(fetchAttributes('operations', network, serverInfo));
  await dispatch(fetchAttributes('accounts', network, serverInfo));
}

export const syncAttributes = () => async (dispatch, state) => {
  const network = state().app.network;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  const blockHead: any = await TezosConseilClient.getBlockHead(serverInfo, network);
  const localHead = getBlockHeadFromLocal();
  if (blockHead[0].level - localHead > SYNC_LEVEL) {
    await dispatch(loadAttributes(network, serverInfo));
    const attributes = state().app.attributes;
    saveAttributes(attributes, blockHead[0].level);
  }
}
