import { TezosFilter } from 'conseiljs';
import { SET_FILTER } from './constants';

export interface SetFilter {
  type: SET_FILTER;
  filters: TezosFilter;
  network: string;
}

export type ArronaxAction = SetFilter;

export const setFilter = (filters: TezosFilter, network: string): SetFilter => ({
  filters,
  network,
  type: SET_FILTER
});
