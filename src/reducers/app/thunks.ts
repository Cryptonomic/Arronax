import { TezosConseilQuery } from 'conseiljs/dist/conseiljs.web';
import { setItemsAction, initDataAction, setLoadingAction, setNetworkAction } from './actions';
import configs from '../../config';
const { getBlocks, getOperations, getAccounts  } = TezosConseilQuery;
const ConseilOperations = {
  blocks: getBlocks,
  operations: getOperations,
  accounts: getAccounts
};

const getConfig = (val) => {
  return configs.find(conf => conf.value === val);
}

export const setItems = (type, items) => {
  return dispatch => {
    dispatch(setItemsAction(type, items));
  };
}

export const submitFilters = () => async (dispatch, state) => {
  dispatch(initDataAction());
  const network = state().app.network;
  const filters = state().app.filters;
  const category = state().app.selectedTab;
  dispatch(setLoadingAction(true));
  const config = getConfig(network);
  const apiKey = config.key;
  const url = `${config.url}${network}`;
  const items = await ConseilOperations[category](url, filters, apiKey);
  dispatch(setItemsAction(category, items));
  dispatch(setLoadingAction(false));
}

export const changeNetwork = (network: string) => async (dispatch, state) => {
  const oldNetwork = state().app.network;
  if (oldNetwork === network) return;
  dispatch(initDataAction());
  dispatch(setNetworkAction(network));
  // const filters = state().app.filters;
  // const category = state().app.selectedTab;
  // dispatch(setLoadingAction(true));
  // const config = getConfig(network);
  // const apiKey = config.key;
  // const url = `${config.url}${network}`;
  // const items = await ConseilOperations[category](url, filters, apiKey);
  // dispatch(setItemsAction(category, items));
  // dispatch(setLoadingAction(false));
}

export const fetchItemsAction = (category: string) => async (dispatch, state) => {
  const network = state().app.network;
  const filters = state().app.filters;
  const originItems = state().app[category];
  if (originItems.length > 0) return;
  dispatch(setLoadingAction(true));
  const config = getConfig(network);
  const apiKey = config.key;
  const url = `${config.url}${network}`;
  const items = await ConseilOperations[category](url, filters, apiKey);
  dispatch(setItemsAction(category, items));
  dispatch(setLoadingAction(false));
};
