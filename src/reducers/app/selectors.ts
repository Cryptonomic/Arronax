import { createSelector } from 'reselect';

export const getAppState = state => state.app;

export const getItems = createSelector(
  getAppState,
  apps => apps[apps.selectedEntity]
);

export const getLoading = createSelector(
  getAppState,
  apps => apps.isLoading
);

export const getColumns = createSelector(
  getAppState,
  apps => apps.columns[apps.selectedEntity]
);

export const getFilter = createSelector(
  getAppState,
  apps => apps.filters
);

export const getNetwork = createSelector(
  getAppState,
  apps => apps.network
);

export const getEntity = createSelector(
  getAppState,
  apps => apps.selectedEntity
);

export const getAttributes = createSelector(
  getAppState,
  apps => apps.attributes[apps.selectedEntity]
);

export const getOperators = createSelector(
  getAppState,
  apps => apps.operators
);

export const getSelectedFilters = createSelector(
  getAppState,
  apps => apps.selectedFilters[apps.selectedEntity]
);

export const getAvailableValues = createSelector(
  getAppState,
  apps => apps.availableValues[apps.selectedEntity]
);

export const getSelectedValues = createSelector(
  getAppState,
  apps => apps.selectedValues[apps.selectedEntity]
);

export const getRows = createSelector(
  getAppState,
  apps => apps.rowCount
);

export const getFilterCount = createSelector(
  getAppState,
  apps => apps.filterCount[apps.selectedEntity]
);

export const getIsFullLoaded = createSelector(
  getAppState,
  apps => apps.isFullLoaded
);
