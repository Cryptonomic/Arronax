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

const getAttributesForQuery = (attributes, entity) => {
  if (entity === 'blocks') {
    return [
      'level',
      'proto',
      'predecessor',
      'timestamp',
      'validation_pass',
      'fitness',
      'context',
      'signature',
      'protocol',
      'chain_id',
      'hash',
      'operations_hash',
    ];
  } else {
    let attr = [];
    attributes[entity].forEach(attribs => {
      attr.push(attribs.name);
    });
    return attr;
  }
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

export const changeNetwork = (network: string) => async (dispatch, state) => {
  // cannot read substring of null error. This way of querying is best though, will update for custom queries when the time comes.
  const oldNetwork = state().app.network;
  if (oldNetwork === network) return;
  dispatch(setLoadingAction(true));
  dispatch(initDataAction());
  dispatch(setNetworkAction(network));
  const entity = state().app.selectedEntity;
  const config = getConfig(network);
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  const attributes = state().app.attributes;
  const starters = getAttributesForQuery(attributes, entity);
  let query = blankQuery();
  query = addFields(query, ...starters);
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
  // find what attribute all 3 share so that you can set that attribute for the addOrdering funciton 2nd argument
  const originItems = state().app[entity];
  if (originItems.length > 0) return;
  const network = state().app.network;
  const config = getConfig(network);
  const attributes = state().app.attributes;
  const starters = getAttributesForQuery(attributes, entity);
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  dispatch(setLoadingAction(true));
  let query = blankQuery();
  query = addFields(query, ...starters);
  query = setLimit(query, 100);
  query = addOrdering(query, 'block_level', ConseilSortDirection.DESC);
  const items = await executeEntityQuery(
    serverInfo,
    'tezos',
    network,
    entity,
    query
  );
  console.log(items);
  await dispatch(setItemsAction(entity, items));
  await dispatch(setLoadingAction(false));
};

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
