import * as constants from '../constants/constants';

export interface SwitchMode {
    type: constants.SWITCH_MODE;
}

export interface SwitchTab {
    type: constants.SWITCH_TAB;
}

export interface SetFilter {
    type: constants.SET_FILTER;
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

export function switchTab(): SwitchTab {
    return {
        type: constants.SWITCH_TAB
    };
}

export function setFilter(): SetFilter {
    return {
        type: constants.SET_FILTER
    };
}

export function resetAll(): ResetAll {
    return {
        type: constants.RESET_ALL
    };
}
