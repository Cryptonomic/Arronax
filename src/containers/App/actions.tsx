import { TezosFilter } from 'conseiljs';
import { SET_FILTER, SET_NETWORK } from './constants';

export interface SetFilter {
  type: SET_FILTER;
  filters: TezosFilter;
}

export interface SetNetwork {
  type: SET_NETWORK;
  network: string;
}

export type ArronaxAction = SetFilter | SetNetwork;

export const setFilter = (filters: TezosFilter): SetFilter => ({
  filters,
  type: SET_FILTER
});

export const setNetwork = (network: string): SetNetwork => ({
  network,
  type: SET_NETWORK
});
