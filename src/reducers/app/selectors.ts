import { createSelector } from 'reselect';

export const getAppState = state => state.app;

export const getItems = createSelector(
  getAppState,
  apps => apps[apps.selectedTab]
);

export const getLoading = createSelector(
  getAppState,
  apps => apps.isLoading
);

export const getColumns = createSelector(
  getAppState,
  apps => apps.columns
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

export const getAttributes = createSelector(
  getAppState,
  apps => apps.attributes[apps.selectedTab]
);

export const getOperators = createSelector(
  getAppState,
  apps => apps.operators
);

export const getSelectedFilters = createSelector(
  getAppState,
  apps => apps.selectetFilters[apps.selectedTab]
);
