import {
  ConseilMetadataClient,
  ConseilDataClient,
  ConseilQueryBuilder,
  ConseilSortDirection,
} from 'conseiljs';
const { executeEntityQuery } = ConseilDataClient;
const { blankQuery, addOrdering, addFields, setLimit } = ConseilQueryBuilder;
import {
  setValuesAction,
  setItemsAction,
  initDataAction,
  setLoadingAction,
  setNetworkAction,
  setColumnsAction,
  setAttributesAction,
} from './actions';
import getConfigs from '../../utils/getconfig';

const configs = getConfigs();
const { getAttributes, getAttributeValues } = ConseilMetadataClient;

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

// THIS WILL BE NECESSARY TO DESTRUCTURE selectedValues THAT MEET THESE CRITERIA WHEN SUBMITTING A QUERY
// if (
//   (selectedEntity === 'operations' && filter.name === 'kind') ||
//   (selectedEntity === 'operations' && filter.name === 'status') ||
//   (selectedEntity === 'operations' && filter.name === 'spendable') ||
//   (selectedEntity === 'operations' && filter.name === 'delegatable') ||
//   (selectedEntity === 'accounts' && filter.name === 'spendable') ||
//   (selectedEntity === 'accounts' && filter.name === 'delegate_setable')
// ) {
//   if (val !== null) {
//     const item = val.replace(/\s+/g, '_').toLowerCase();
//     newVal = item;
//   } else if (val === null) {
//     newVal = 'null';
//   }
//   setValue(newVal);

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
  const serverInfo = {
    url: config.url,
    apiKey: config.key,
  };
  const attributes = await getAttributes(
    serverInfo,
    'tezos',
    network,
    selectedEntity
  );
  dispatch(setAttributesAction(selectedEntity, attributes));
  dispatch(setLoadingAction(false));
};

export const fetchValues = (attribute: string) => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  const network = state().app.network;
  dispatch(setLoadingAction(true));
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
  dispatch(setValuesAction(newValues));
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

export const fetchColumns = columns => async (dispatch, state) => {
  const selectedEntity = state().app.selectedEntity;
  const newColumns = await getInitialColumns(selectedEntity, columns);
  columns[selectedEntity] = newColumns;
  await dispatch(setColumns(selectedEntity, newColumns));
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
  const attributeNames = getAttributeNames(attributes, entity);
  const columns = state().app.columns;
  columns[entity] = attributes[entity];
  await dispatch(fetchColumns(columns[entity]));
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
