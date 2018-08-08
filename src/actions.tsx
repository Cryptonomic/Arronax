import * as constants from './constants';
import { DataView } from './types';
import { TezosFilter } from 'conseiljs';

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

export function switchTab(dataView: DataView): SwitchTab {
    return {
        type: constants.SWITCH_TAB,
        dataView
    };
}

export function setFilter(filters: TezosFilter): SetFilter {
    return {
        type: constants.SET_FILTER,
        filters
    };
}

export function setNetwork(network: string): SetNetwork {
    return {
        type: constants.SET_NETWORK,
        network
    };
}
