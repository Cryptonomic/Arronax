// Beware of getting and manipulating state in the app. Object are passed as references. Make sure to clone object before.

import { createSelector } from 'reselect';
import { RootState } from '../index';

export const getAppState = (state: RootState) => state.app;

export const getItems = createSelector(getAppState, (apps) => apps.items[apps.selectedEntity]);

export const getLoading = createSelector(getAppState, (apps) => apps.isLoading);

export const getColumns = createSelector(getAppState, (apps) => (apps.selectedEntity && apps.columns[apps.selectedEntity]) || []);

export const getEntity = createSelector(getAppState, (apps) => apps.selectedEntity);

export const getEntities = createSelector(getAppState, (apps) => [...apps.entities]);

export const getAttributes = createSelector(getAppState, (apps) => [...apps.attributes[apps.selectedConfig.platform][apps.selectedConfig.network][apps.selectedEntity]] || []);

export const getAttributesAll = createSelector(getAppState, (apps) => apps.attributes);

export const getOperators = createSelector(getAppState, (apps) => apps.operators);

export const getSelectedFilters = createSelector(getAppState, (apps) => apps.selectedFilters[apps.selectedEntity] || []);

export const getAvailableValues = createSelector(getAppState, (apps) => apps.availableValues[apps.selectedEntity]);

export const getRows = createSelector(getAppState, (apps) => apps.rowCount);

export const getFilterCount = createSelector(getAppState, (apps) => apps.filterCount[apps.selectedEntity]);

export const getIsFullLoaded = createSelector(getAppState, (apps) => apps.isFullLoaded);

export const getModalItem = createSelector(getAppState, (apps) => apps.selectedModalItem);

export const getModalSubItem = createSelector(getAppState, (apps) => apps.selectedModalSubItem);

export const getSort = createSelector(getAppState, (apps) => apps.sort[apps.selectedEntity][0]);

export const getConfigs = createSelector(getAppState, (apps) => apps.configs);

export const getSelectedConfig = createSelector(getAppState, (apps) => apps.selectedConfig);

export const getAggregations = createSelector(getAppState, (apps) => apps.aggregations[apps.selectedEntity] || []);

export const getAggFunctions = createSelector(getAppState, (apps) => apps.aggFunctions);

// Home Page selectors
export const getHourlyTransactionsLoading = createSelector(getAppState, (apps) => apps.isTransactionsLoading);

export const getHourlyTransactions = createSelector(getAppState, (apps) => apps.hourlytransactions);

export const getTopAccounts = createSelector(getAppState, (apps) => apps.topAccounts);

export const getTopAccountsLoading = createSelector(getAppState, (apps) => apps.isTopAccountsLoading);

export const getTopBakers = createSelector(getAppState, (apps) => apps.topBakers); 

export const getTopBakersLoading = createSelector(getAppState, (apps) => apps.isTopBakersLoading);