import * as constants from './constants';
import { DataView } from './types';
import { ConseilFilter } from './Conseil';

export interface SwitchMode {
    type: constants.SWITCH_MODE;
}

export interface SwitchTab {
    type: constants.SWITCH_TAB;
    dataView: DataView;
}

export interface SetFilter {
    type: constants.SET_FILTER;
    filters: ConseilFilter;
}

export interface ResetAll {
    type: constants.RESET_ALL;
}

export type ArronaxAction = SwitchMode | SwitchTab | SetFilter | ResetAll;

export function switchMode(): SwitchMode {
    return {
        type: constants.SWITCH_MODE
    };
}

export function switchTab(dataView: DataView): SwitchTab {
    return {
        type: constants.SWITCH_TAB,
        dataView: dataView
    };
}

export function setFilter(filters: ConseilFilter): SetFilter {
    return {
        type: constants.SET_FILTER,
        filters: filters
    };
}

export function resetAll(): ResetAll {
    return {
        type: constants.RESET_ALL
    };
}
