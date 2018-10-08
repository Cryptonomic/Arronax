import { TezosFilter } from 'conseiljs';
import { DataView } from 'types';
import * as constants from './constants';

export interface SwitchTab {
  type: constants.SWITCH_TAB;
  dataView: DataView;
}

export interface SetFilter {
  type: constants.SET_FILTER;
  filters: TezosFilter;
}

export interface SetNetwork {
  type: constants.SET_NETWORK;
  network: string;
}

export type ArronaxAction = SwitchTab | SetFilter | SetNetwork;

export const switchTab = (dataView: DataView): SwitchTab =>
  ({
    dataView,
    type: constants.SWITCH_TAB
  });

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
