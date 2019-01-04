import { createSelector } from 'reselect';
// import { TEZOS, CONSEIL } from '../../constants/NodesTypes';

export const getAppState = state => state.app;
// export const getItemState = (state, type) => state.app[type];

// export const getTezosSelectedNode = createSelector(
//   getAppState,
//   settings => settings.get('tezosSelectedNode')
// );

export const getItems = createSelector(
  getAppState,
  apps => apps[apps.selectedTab]
);

export const getLoading = createSelector(
  getAppState,
  apps => apps.isLoading
);

export const getFilter = createSelector(
  getAppState,
  apps => apps.filters
);

export const getNetwork = createSelector(
  getAppState,
  apps => apps.network
);

export const getTab = createSelector(
  getAppState,
  apps => apps.selectedTab
);
