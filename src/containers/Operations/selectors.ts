import { createSelector } from 'reselect';
import { OperationsStateMap, GlobalStateMap } from 'types';
import { initialState } from './reducer';

export const selectOperationsDomain = (state: GlobalStateMap): OperationsStateMap =>
  state.get('operations', initialState);

export const makeSelectOperations = () =>
  createSelector<GlobalStateMap, any, any>(
    selectOperationsDomain,
    (substate: OperationsStateMap) => substate.get('items').toJS()
  );

export const makeSelectFetching = () =>
  createSelector<GlobalStateMap, any, any>(
    selectOperationsDomain,
    (substate: OperationsStateMap) => substate.get('fetching')
  );

export const makeSelectError = () =>
    createSelector<GlobalStateMap, any, any>(
        selectOperationsDomain,
        (substate: OperationsStateMap) => substate.get('error')
    );
