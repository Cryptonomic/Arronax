import {
  TezosConseilClient,
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  ConseilSortDirection,
} from 'conseiljs';
const { executeEntityQuery } = ConseilDataClient;
const { blankQuery, addOrdering, addFields, setLimit } = ConseilQueryBuilder;
import {
  setItemsAction,
  initDataAction,
  setLoadingAction,
  setNetworkAction,
  setColumnsAction,
  setAttributesAction,
} from './actions';
import getConfigs from '../../utils/getconfig';

const configs = getConfigs();
const { getBlocks, getOperations, getAccounts } = TezosConseilClient;
const { getAttributes } = ConseilMetadataClient;
const ConseilOperations = {
  blocks: getBlocks,
  operations: getOperations,
  accounts: getAccounts,
};

const getConfig = val => {
  return configs.find(conf => conf.value === val);
};

const getAttributeNames = (attributes, entity) => {
  let attr = [];
  attributes[entity].forEach(attribs => {
    attr.push(attribs.name);
  });
  return attr;
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

// WILL NEED UPDATE TO V2!
// export const submitFilters = () => async (dispatch, state) => {
//   dispatch(initDataAction());
//   const network = state().app.network;
//   const filters = state().app.filters;
//   const entity = state().app.selectedEntity;
//   dispatch(setLoadingAction(true));
//   const config = getConfig(network);
//   const serverInfo = {
//     url: config.url,
//     apiKey: config.key,
//   };
//   const items = await ConseilOperations[entity](serverInfo, network, filters);
//   dispatch(setItemsAction(entity, items));
//   dispatch(setLoadingAction(false));
// };
export const fetchAttributes = () => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  if (state().app.attributes[selectedEntity].length > 0) {
    return;
  }
  const network = state().app.network;
  dispatch(setLoadingAction(true));
  const config = getConfig(network);
  const attributes = await getAttributes(
    config.url,
    config.key,
    'tezos',
    network,
    selectedEntity
  );
  dispatch(setAttributesAction(selectedEntity, attributes));
  dispatch(setLoadingAction(false));
};

export const changeNetwork = (network: string) => async (dispatch, state) => {
  const oldNetwork = state().app.network;
  if (oldNetwork === network) return;
  dispatch(setLoadingAction(true));
  dispatch(initDataAction());
  dispatch(setNetworkAction(network));
  await dispatch(fetchAttributes());
  const entity = state().app.selectedEntity;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  const attributes = state().app.attributes;
  const attributeNames = getAttributeNames(attributes, entity);
  let query = blankQuery();
  query = addFields(query, ...attributeNames);
  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    entity,
    query
  );
  dispatch(setItemsAction(entity, items));
  dispatch(setLoadingAction(false));
};

export const fetchItemsAction = (entity: string) => async (dispatch, state) => {
  const originItems = state().app[entity];
  if (originItems.length > 0) return;
  dispatch(setLoadingAction(true));
  const network = state().app.network;
  const config = getConfig(network);
  const attributes = state().app.attributes;
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  await dispatch(fetchAttributes());
  // await dispatch(setColumns(entity, attributes[entity]));
  const attributeNames = getAttributeNames(attributes, entity);
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
  await dispatch(setLoadingAction(false));
};
