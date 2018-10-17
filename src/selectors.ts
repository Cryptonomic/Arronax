import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { TezosFilter } from 'conseiljs';
import {
  DataView,
  ArronaxImmutableState,
  ArronaxState,
  ImmutableMap
} from './types';

export const selectFiltersDomain = (
  state: ArronaxImmutableState
): ImmutableMap<TezosFilter> => state.get('filters');

export const makeSelectFilters = createSelector<
  ArronaxImmutableState,
  ImmutableMap<TezosFilter>,
  TezosFilter
>(
  selectFiltersDomain,
  (substate: ImmutableMap<TezosFilter>): TezosFilter => substate.toJS()
);

export const makeSelectDataView = (state: ArronaxImmutableState): number =>
  state.get('dataView');

export const makeSelectNetwork = (state: ArronaxImmutableState): string =>
  state.get('network');
