import * as constants from './constants';
import { DataView } from './types';
import { ConseilFilter } from './Conseil';

export interface SwitchTab {
    type: constants.SWITCH_TAB;
    dataView: DataView;
}

export interface SetFilter {
    type: constants.SET_FILTER;
    filters: ConseilFilter;
}

export type ArronaxAction = SwitchTab | SetFilter;

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
