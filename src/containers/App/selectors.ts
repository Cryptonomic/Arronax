import { createSelector } from 'reselect';
import { TezosFilter } from 'conseiljs';
import { ArronaxStateMap, GlobalStateMap } from 'types';
import { initialState } from './reducer';

export const selectGlobalDomain = (state: GlobalStateMap): ArronaxStateMap =>
  state.get('global', initialState);

export const makeSelectFilters = () =>
  createSelector<GlobalStateMap, ArronaxStateMap, TezosFilter>(
    selectGlobalDomain,
    (substate: ArronaxStateMap): TezosFilter => substate.get('filters').toJS()
  );

export const makeSelectNetwork = () =>
  createSelector<GlobalStateMap, ArronaxStateMap, string>(
    selectGlobalDomain,
    (substate: ArronaxStateMap): string => substate.get('network')
  );
