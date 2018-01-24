import * as constants from '../constants/constants'

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

export interface Blocks {
    type: constants.BLOCKS;
}

export interface Accounts {
    type: constants.ACCOUNTS;
}

export interface Operations {
    type: constants.OPERATIONS;
}

export interface BlockID {
    type: constants.BLOCK_ID;
}

export interface AccountID {
    type: constants.ACCOUNT_ID;
}

export interface OperationID {
    type: constants.OPERATION_ID;
}

export type ArronaxAction = SwitchMode | SwitchTab | SetFilter | ResetAll |
  Blocks | BlockID | Operations | Accounts | AccountID | OperationID;

export function switchMode(): SwitchMode {
    return {
        type: constants.SWITCH_MODE
    }
}

export function switchTab(): SwitchTab {
    return {
        type: constants.SWITCH_TAB
    }
}

export function setFilter(): SetFilter {
    return {
        type: constants.SET_FILTER
    }
}

export function resetAll(): ResetAll {
    return {
        type: constants.RESET_ALL
    }
}

export function blocks(): Blocks {
    return {
        type: constants.BLOCKS
    }
}

export function accounts(): Accounts {
    return {
        type: constants.ACCOUNTS
    }
}

export function operations(): Operations {
    return {
        type: constants.OPERATIONS
    }
}

export function blockID(): BlockID {
    return {
        type: constants.BLOCK_ID
    }
}

export function accountID(): AccountID {
    return {
        type: constants.ACCOUNT_ID
    }
}

export function operationID(): OperationID {
    return {
        type: constants.OPERATION_ID
    }
}
