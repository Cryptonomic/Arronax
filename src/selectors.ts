import { createSelector } from 'reselect';
import { TezosFilter } from 'conseiljs';
import { ArronaxImmutableState, ImmutableMap } from './types';
import { initialState } from './reducers';

export const selectFiltersDomain = (
  state: ArronaxImmutableState
): ImmutableMap<TezosFilter> =>
  state.get('filters', initialState.get('filters'));

export const makeSelectFilters = createSelector<
  ArronaxImmutableState,
  ImmutableMap<TezosFilter>,
  TezosFilter
>(
  selectFiltersDomain,
  (substate: ImmutableMap<TezosFilter>): TezosFilter => substate.toJS()
);

export const makeSelectDataView = (state: ArronaxImmutableState): number =>
  state.get('dataView', initialState.get('dataView'));

export const makeSelectNetwork = (state: ArronaxImmutableState): string =>
  state.get('network', initialState.get('network'));
