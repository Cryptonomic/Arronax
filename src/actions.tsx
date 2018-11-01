import { TezosFilter } from 'conseiljs';
import * as constants from './constants';

export interface SetFilter {
  type: constants.SET_FILTER;
  filters: TezosFilter;
}

export interface SetNetwork {
  type: constants.SET_NETWORK;
  network: string;
}

export type ArronaxAction =  SetFilter | SetNetwork;

export const setFilter = (filters: TezosFilter): SetFilter =>
  ({
    filters,
    type: constants.SET_FILTER
  });

export const setNetwork = (network: string): SetNetwork =>
  ({
    network,
    type: constants.SET_NETWORK
  });
