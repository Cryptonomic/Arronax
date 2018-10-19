import { createSelector } from 'reselect';
import { OperationsStateMap, GlobalStateMap } from 'types';
import { initialState } from './reducer';

export const selectAccountsDomain = (state: GlobalStateMap): OperationsStateMap =>
  state.get('operations', initialState);

export const makeSelectOperations = () =>
  createSelector<GlobalStateMap, any, any>(
    selectAccountsDomain,
    (substate: OperationsStateMap) => substate.get('items').toJS()
  );

export const makeSelectFetching = () =>
  createSelector<GlobalStateMap, any, any>(
    selectAccountsDomain,
    (substate: OperationsStateMap) => substate.get('fetching')
  );
