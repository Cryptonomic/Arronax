import { createSelector } from 'reselect';
import { AccountsStateMap, GlobalStateMap } from 'types';
import { initialState } from './reducer';

export const selectAccountsDomain = (state: GlobalStateMap): AccountsStateMap =>
  state.get('accounts', initialState);

export const makeSelectAccounts = () =>
  createSelector<GlobalStateMap, any, any>(
    selectAccountsDomain,
    (substate: AccountsStateMap) => substate.get('items').toJS()
  );

export const makeSelectFetching = () =>
  createSelector<GlobalStateMap, any, any>(
    selectAccountsDomain,
    (substate: AccountsStateMap) => substate.get('fetching')
  );

export const makeSelectError = () =>
    createSelector<GlobalStateMap, any, any>(
        selectAccountsDomain,
        (substate: AccountsStateMap) => substate.get('error')
    );
