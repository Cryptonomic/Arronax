import { createSelector } from 'reselect';
import { BlocksStateMap, GlobalStateMap } from 'types';
import { initialState } from './reducer';

export const selectBlocksDomain = (state: GlobalStateMap): BlocksStateMap =>
  state.get('blocks', initialState);

export const makeSelectBlocks = () =>
  createSelector<GlobalStateMap, any, any>(
    selectBlocksDomain,
    (substate: BlocksStateMap) => substate.get('items').toJS()
  );

export const makeSelectFetching = () =>
  createSelector<GlobalStateMap, any, any>(
    selectBlocksDomain,
    (substate: BlocksStateMap) => substate.get('fetching')
  );
